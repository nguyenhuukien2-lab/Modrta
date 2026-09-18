import http from 'node:http'

const BASE = process.env.BASE_URL || 'http://localhost:4000'

const json = (body) => JSON.stringify(body)

function request(method, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }, (res) => {
      let raw = ''
      res.on('data', (chunk) => {
        raw += chunk
      })
      res.on('end', () => {
        try {
          const parsed = raw ? JSON.parse(raw) : {}
          resolve({ status: res.statusCode, body: parsed })
        } catch {
          resolve({ status: res.statusCode, body: raw })
        }
      })
    })

    req.on('error', reject)
    req.write(data ? json(data) : '')
    req.end()
  })
}

async function main() {
  const email = `smoke-${Date.now()}@example.com`
  const password = 'password123'
  const name = 'Smoke Tester'

  const register = await request('POST', '/api/auth/register', { email, password, name })
  console.log('REGISTER', register.status, register.body)

  const login = await request('POST', '/api/auth/login', { email, password })
  console.log('LOGIN', login.status, login.body)

  const token = login.body?.token
  if (!token) {
    console.error('No token returned from login')
    process.exit(1)
  }

  const productRes = await request('GET', '/api/products')
  console.log('PRODUCTS', productRes.status, Array.isArray(productRes.body?.data) ? productRes.body.data.length : 'unknown')

  const firstProduct = productRes.body?.data?.[0]
  if (!firstProduct) {
    console.error('No product available for checkout smoke test')
    process.exit(1)
  }

  const order = await request('POST', '/api/orders', {
    items: [{ productId: firstProduct.id, quantity: 1, size: 'M', ice: 'normal', sugar: '100', milk: 'Yến mạch' }],
    deliveryMethod: 'delivery',
    paymentMethod: 'cod',
    customerName: name,
    customerPhone: '0900000000',
    customerEmail: email,
    address: '12 Lê Lợi',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    note: 'Smoke test',
    ecoPackaging: false,
  }, { Authorization: `Bearer ${token}` })

  console.log('ORDER', order.status, order.body)

  if (order.status >= 400) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
