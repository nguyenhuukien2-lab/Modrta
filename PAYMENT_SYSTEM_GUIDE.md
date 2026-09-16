# Giai đoạn 5: Payment System & Loyalty Points Guide

## Overview

Modtra now supports 5 payment methods and a loyalty points system with tier-based benefits. This guide explains how to test and use each component.

---

## Payment Methods

### 1. **COD (Cash on Delivery)**
- **Status**: ✅ Fully implemented
- **Flow**: 
  1. Customer selects COD at checkout
  2. Order is created with `paymentStatus: "pending"`
  3. Payment confirmation shown to customer
  4. Loyalty points added to account

- **Testing**:
  ```bash
  # Checkout page: Select "Thanh toán khi nhận hàng (COD)"
  # Submit order
  # Verify payment status in order details
  ```

### 2. **VietQR**
- **Status**: ✅ Fully implemented
- **Features**:
  - Dynamic QR code generation
  - Transaction reference tracking
  - Manual payment verification
  - Automatic loyalty points calculation

- **Endpoints**:
  - `POST /api/payments/vietqr` - Generate QR code
  - `POST /api/payments/vietqr/verify` - Verify payment
  - `GET /api/payments/:transactionRef` - Check payment status

- **Testing Flow**:
  ```
  1. Create order with VietQR payment method
  2. Call POST /api/payments/vietqr { orderId }
  3. Receive QR code + transactionRef
  4. Simulate payment by calling POST /api/payments/vietqr/verify { transactionRef }
  5. Verify payment is marked as "paid"
  6. Check loyalty points were added
  ```

- **Example Request**:
  ```bash
  curl -X POST http://localhost:4000/api/payments/vietqr \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "orderId": "order-id-123" }'
  ```

- **Response**:
  ```json
  {
    "success": true,
    "transactionRef": "VQR-ORD-20260916-0001-1694884506123",
    "qrCode": "data:image/png;base64,...",
    "amount": 250000,
    "orderNumber": "ORD-20260916-0001",
    "message": "Scan QR code to complete payment"
  }
  ```

### 3. **MoMo**
- **Status**: ✅ Fully implemented (requires MoMo credentials)
- **Features**:
  - Dynamic request ID generation
  - Webhook signature verification
  - Automatic payment status updates
  - Loyalty points calculation

- **Endpoints**:
  - `POST /api/payments/momo/init` - Initialize payment
  - `POST /api/payments/momo/callback` - Webhook receiver
  - `GET /api/payments/:transactionRef` - Check payment status

- **Required Environment Variables**:
  ```
  MOMO_PARTNER_CODE=MOMOXXXXXX
  MOMO_ACCESS_KEY=your-access-key
  MOMO_SECRET_KEY=your-secret-key
  ```

- **Testing Flow**:
  ```
  1. Set MoMo credentials in .env
  2. Create order with MoMo payment method
  3. Call POST /api/payments/momo/init { orderId }
  4. In production: User redirects to MoMo app to pay
  5. MoMo calls webhook at POST /api/payments/momo/callback
  6. Verify payment is marked as "paid"
  7. Check loyalty points were added
  ```

- **Webhook Testing** (for local development):
  ```bash
  # Simulate MoMo callback with result code 0 (success)
  curl -X POST http://localhost:4000/api/payments/momo/callback \
    -H "Content-Type: application/json" \
    -d '{
      "requestId": "timestamp-order-id",
      "resultCode": 0,
      "message": "Successful",
      "amount": 250000,
      "transId": "2109131234567890",
      "extraData": "base64-encoded-json"
    }'
  ```

### 4. **ZaloPay**
- **Status**: ⏳ Not yet implemented
- **Planned for future release**

### 5. **Card Payment**
- **Status**: ⏳ Not yet implemented
- **Planned for future release**

---

## Loyalty Points System

### Tier System

```
Member (👤)
├─ 0-999 points
├─ 1 point = 1000đ spent
└─ Benefits: Standard support, weekly deals

Silver (⭐) 
├─ 1000-4999 points
├─ 1.2 points = 1000đ spent
└─ Benefits: Free shipping, daily deals

Gold (🏆)
├─ 5000+ points
├─ 1.5 points = 1000đ spent
└─ Benefits: VIP shipping, exclusive deals
```

### Points Earning
- **Order Purchase**: `Math.floor(orderTotal / 1000)` points
  - Example: 250,000đ order = 250 points
- **Automatic tier upgrade** based on total points

### Points Redemption
- **Redemption Rate**: 1 point = 100đ discount
  - Example: 500 points = 50,000đ discount
- **Minimum**: 100 points
- **Step**: 100 points

### Endpoints

#### Get Loyalty Status
```bash
GET /api/loyalty/status
Authorization: Bearer TOKEN

Response:
{
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "silver",
    "loyaltyPoints": 2500
  },
  "recentLogs": [...],
  "tierThresholds": { "member": 0, "silver": 1000, "gold": 5000 },
  "nextTierPoints": 5000,
  "nextTierPointsRemaining": 2500
}
```

#### Add Points (Internal API)
```bash
POST /api/loyalty/add-points
X-Internal-Secret: INTERNAL_API_SECRET
Content-Type: application/json

{
  "userId": "user-123",
  "amount": 1000,
  "reason": "order_purchase",
  "orderId": "order-123"
}

Response:
{
  "success": true,
  "pointLog": { ... },
  "user": {
    "id": "user-123",
    "loyaltyPoints": 3500,
    "tier": "silver"
  }
}
```

**Note**: This endpoint requires `X-Internal-Secret` header for security. Used internally after payment confirmation.

#### Redeem Points
```bash
POST /api/loyalty/redeem
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "amount": 500
}

Response:
{
  "success": true,
  "discountVND": 50000,
  "message": "Redeemed 500 points for 50000 VND discount",
  "remainingPoints": 2000
}
```

#### Get Point History
```bash
GET /api/loyalty/history?page=1&limit=20
Authorization: Bearer TOKEN

Response:
{
  "logs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "pages": 3
  }
}
```

### Loyalty Dashboard
- **URL**: `/loyalty`
- **Features**:
  - Current tier and points display
  - Progress to next tier
  - Benefits by tier
  - Redeem points form
  - Recent transaction history
  - How it works guide

---

## Testing Guide

### Prerequisites
1. Backend running: `npm run dev` in `/backend`
2. Frontend running: `npm run dev` in root
3. Database: Supabase PostgreSQL connected
4. Auth token: Login to get JWT token

### Test Scenario 1: COD Purchase

```bash
# 1. Register/Login
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

# 2. Create Order (COD)
POST /api/orders
Authorization: Bearer TOKEN
{
  "items": [{ "productId": "prod-1", "quantity": 1 }],
  "deliveryMethod": "delivery",
  "paymentMethod": "cod",
  "customerName": "Test User",
  "customerPhone": "0901234567",
  "address": "123 Nguyen Hue",
  "district": "Q1",
  "city": "TP. Ho Chi Minh"
}

# 3. Verify Order Created
GET /api/orders/ORDER_ID
Authorization: Bearer TOKEN

# 4. Check Loyalty Points
GET /api/loyalty/status
Authorization: Bearer TOKEN
```

### Test Scenario 2: VietQR Purchase

```bash
# 1. Create Order (VietQR)
POST /api/orders
Authorization: Bearer TOKEN
{
  "items": [...],
  "paymentMethod": "vietqr",
  ...
}
# Response: { orderId: "order-123", ... }

# 2. Generate QR Code
POST /api/payments/vietqr
Authorization: Bearer TOKEN
{
  "orderId": "order-123"
}
# Response: { qrCode: "data:image/png;base64,...", transactionRef: "VQR-..." }

# 3. Verify Payment (Simulate QR Scan)
POST /api/payments/vietqr/verify
Authorization: Bearer TOKEN
{
  "transactionRef": "VQR-..."
}

# 4. Check Payment Status
GET /api/payments/VQR-...
Authorization: Bearer TOKEN

# 5. Verify Points Added
GET /api/loyalty/status
Authorization: Bearer TOKEN
```

### Test Scenario 3: MoMo Purchase

```bash
# 1. Create Order (MoMo)
POST /api/orders
Authorization: Bearer TOKEN
{
  "items": [...],
  "paymentMethod": "momo",
  ...
}

# 2. Initialize MoMo Payment
POST /api/payments/momo/init
Authorization: Bearer TOKEN
{
  "orderId": "order-123"
}
# Response: { requestId: "...", signature: "...", ... }

# 3. Simulate MoMo Callback
POST /api/payments/momo/callback
{
  "requestId": "...",
  "resultCode": 0,
  "transId": "2109131234567890",
  "extraData": "..."
}

# 4. Verify Payment and Points
GET /api/loyalty/status
Authorization: Bearer TOKEN
```

### Test Scenario 4: Loyalty Redemption

```bash
# 1. Get Current Points
GET /api/loyalty/status
Authorization: Bearer TOKEN

# 2. Redeem Points
POST /api/loyalty/redeem
Authorization: Bearer TOKEN
{
  "amount": 1000
}

# 3. Verify New Point Balance
GET /api/loyalty/status
Authorization: Bearer TOKEN
```

---

## Daily Reconciliation

The system includes a daily reconciliation job to:
- Check pending MoMo payments older than 1 hour (mark as failed if no confirmation)
- Delete old failed/refunded payments (>30 days)
- Update user tiers based on loyalty points

### Trigger Manually

```bash
POST /api/admin/reconciliation/daily
X-Cron-Secret: CRON_SECRET_VALUE

Response:
{
  "success": true,
  "message": "Daily reconciliation completed",
  "summary": {
    "timestamp": "2026-09-16T...",
    "pendingPaymentsChecked": 5,
    "paymentsFailed": 2,
    "paymentsProcessed": 5,
    "oldPaymentsDeleted": 3,
    "userTiersUpdated": 1
  }
}
```

### Schedule with External Service

Use GitHub Actions, n8n, or any cron service:

```bash
# Call daily at 2 AM Vietnam time
curl -X POST https://api.modtra.com/api/admin/reconciliation/daily \
  -H "X-Cron-Secret: $CRON_SECRET"
```

---

## Database Models

### Payment Model
```prisma
model Payment {
  id              String
  transactionRef  String        @unique
  status          PaymentStatus // pending, paid, failed, refunded
  method          PaymentMethod // vietqr, momo, zalopay, card, cod
  amount          Int
  momoTransId     String?
  momoResultCode  Int?
  qrCode          String?
  createdAt       DateTime
  updatedAt       DateTime
  
  order           Order?
  user            User
}
```

### PointLog Model
```prisma
model PointLog {
  id        String
  amount    Int      // positive (earned) or negative (redeemed)
  reason    String   // "order_purchase", "redeemed", "adjustment"
  orderId   String?
  createdAt DateTime
  
  user      User
}
```

### User Tier Extension
```prisma
model User {
  // ... existing fields
  tier            UserTier @default(member)  // member, silver, gold
  loyaltyPoints   Int      @default(0)
  
  payments        Payment[]
  pointLogs       PointLog[]
}
```

---

## Troubleshooting

### Issue: VietQR QR code not generating
- **Solution**: Check `qrcode` package is installed (`npm list qrcode`)
- **Check**: Verify `QRCode.toDataURL()` is working

### Issue: MoMo webhook not being called
- **Solution**: Use ngrok to expose local server to internet
  ```bash
  ngrok http 4000
  # Update BACKEND_URL in .env to ngrok URL
  ```

### Issue: Loyalty points not adding after payment
- **Solution**: 
  1. Check `INTERNAL_API_SECRET` is set in backend .env
  2. Verify `/api/loyalty/add-points` is being called after payment confirmation
  3. Check PaymentStatus is updated to "paid" before adding points

### Issue: Cannot verify VietQR payment
- **Solution**: 
  1. Ensure transactionRef matches exactly
  2. Check payment exists in database
  3. Verify authorization header token is valid

### Issue: Tier not updating
- **Solution**: 
  1. Run daily reconciliation manually
  2. Check tier thresholds in code (member: 0, silver: 1000, gold: 5000)
  3. Verify user's loyaltyPoints total in database

---

## Security Notes

1. **INTERNAL_API_SECRET**: Protect this - only internal services should call `/api/loyalty/add-points`
2. **CRON_SECRET**: Protect this - only authenticated cron jobs should call reconciliation
3. **MoMo Secret Key**: Validate webhook signatures in production
4. **Payment Verification**: Always verify payment status server-side before marking as paid

---

## Next Steps

- [ ] Integrate real MoMo sandbox for testing
- [ ] Implement ZaloPay payment method
- [ ] Add card payment support
- [ ] Create admin dashboard for payment monitoring
- [ ] Implement payment refund system
- [ ] Add bonus points for reviews
- [ ] Birthday month point multiplier
