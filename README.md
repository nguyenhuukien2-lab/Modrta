# 🍵 Modtra – Trà Matcha & Cà Phê Online

> Website đặt hàng trà matcha và cà phê phong cách cinematic, hiện đại.

## 🌐 Demo

**Live Website:** [https://modrta.vercel.app](https://modrta.vercel.app)

---

## ✨ Tính Năng

- 🛒 **Đặt hàng trực tuyến** – Chọn sản phẩm, thêm vào giỏ hàng, thanh toán dễ dàng
- 👤 **Hệ thống tài khoản** – Đăng ký, đăng nhập, quản lý thông tin cá nhân
- 🎁 **Tích điểm thành viên** – Loyalty points cho mỗi đơn hàng
- 💳 **Thanh toán đa dạng** – VietQR, MoMo, thanh toán khi nhận hàng
- 🔖 **Mã giảm giá** – Coupon system cho khách hàng
- ❤️ **Danh sách yêu thích** – Lưu sản phẩm yêu thích
- ⭐ **Đánh giá sản phẩm** – Review và rating từ khách hàng
- 📍 **Hệ thống cửa hàng** – Tìm cửa hàng gần nhất
- 📦 **Theo dõi đơn hàng** – Xem lịch sử và trạng thái đơn hàng
- 🔔 **Thông báo** – Cập nhật đơn hàng real-time

---

## 🎨 Thiết Kế

- **Cinematic Dark Theme** – Giao diện tối sang trọng
- **Parallax Effects** – Hiệu ứng cuộn 3D chiều sâu
- **Glass Morphism** – Hiệu ứng kính mờ hiện đại
- **Smooth Animations** – Animation mượt mà với custom easing
- **Scroll Reveal** – Hiệu ứng xuất hiện khi cuộn trang
- **Fully Responsive** – Tương thích mọi thiết bị

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Mô tả |
|-----------|-------|
| **Next.js 14** | React framework với App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Zustand** | State management |
| **Lucide React** | Icon library |

### Backend
| Công nghệ | Mô tả |
|-----------|-------|
| **Express.js** | Node.js web framework |
| **Prisma ORM** | Database ORM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **JOSE** | JWT utilities |

### Database & Deployment
| Công nghệ | Mô tả |
|-----------|-------|
| **Supabase** | PostgreSQL cloud database |
| **Vercel** | Frontend + API deployment |

---

## 📁 Cấu Trúc Project

```
Modtra/
├── app/                    # Next.js App Router (Frontend)
│   ├── (auth)/            # Trang đăng nhập, đăng ký
│   ├── (main)/            # Trang chính
│   │   ├── menu/          # Trang menu sản phẩm
│   │   ├── checkout/      # Trang thanh toán
│   │   ├── order-history/ # Lịch sử đơn hàng
│   │   ├── loyalty/       # Điểm thành viên
│   │   ├── account/       # Tài khoản cá nhân
│   │   └── locations/     # Cửa hàng
│   └── api/               # Next.js API Routes
├── backend/               # Express.js Backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, validation
│   │   └── utils/         # JWT, password utils
│   └── prisma/            # Database schema & migrations
├── components/            # React components tái sử dụng
├── lib/                   # Utilities, hooks, context
└── public/                # Static assets
```

---

## 🚀 Chạy Local

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- PostgreSQL (hoặc Supabase account)

### Frontend
```bash
# Clone repo
git clone https://github.com/nguyenhuukien2-lab/Modrta.git
cd Modrta

# Cài dependencies
npm install

# Tạo file .env.local
cp .env.local.example .env.local
# Điền NEXT_PUBLIC_API_URL=http://localhost:4000

# Chạy dev server
npm run dev
```

### Backend
```bash
cd backend

# Cài dependencies
npm install

# Tạo file .env
cp .env.example .env
# Điền DATABASE_URL, JWT_SECRET...

# Generate Prisma client
npm run prisma:generate

# Chạy migration
npm run prisma:migrate

# Seed data
npm run prisma:seed

# Chạy backend
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Lấy danh sách sản phẩm |
| GET | `/api/products/:slug` | Chi tiết sản phẩm |
| GET | `/api/categories` | Danh mục sản phẩm |
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/orders` | Lịch sử đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| GET | `/api/loyalty` | Điểm thành viên |
| POST | `/api/coupons/validate` | Kiểm tra mã giảm giá |

---

## 👨‍💻 Tác Giả

**Nguyễn Hữu Kiên**
- GitHub: [@nguyenhuukien2-lab](https://github.com/nguyenhuukien2-lab)

---

## 📄 License

MIT License © 2026 Modtra
