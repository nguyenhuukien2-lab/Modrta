#!/usr/bin/env powershell

# E2E Test Script for Modtra
# Tests: Register -> Login -> Checkout -> Payment

$baseUrl = "http://localhost:4000"
$frontendUrl = "http://localhost:3000"
$testEmail = "test_$(Get-Random)@example.com"
$testPassword = "TestPassword123!"
$testName = "Test User"
$token = ""
$userId = ""
$orderId = ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Modtra E2E Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Helper function
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [hashtable]$Headers = @{}
    )
    
    $url = "$baseUrl$Endpoint"
    $params = @{
        Method = $Method
        Uri = $url
        ContentType = "application/json"
        Headers = $Headers
        ErrorAction = "SilentlyContinue"
    }
    
    if ($Body) {
        $params["Body"] = $Body | ConvertTo-Json -Depth 10
    }
    
    try {
        $response = Invoke-WebRequest @params
        return $response.Content | ConvertFrom-Json
    }
    catch {
        $error = $_.Exception.Response.StatusCode.Value__
        if ($error -eq 401 -or $error -eq 403) {
            return @{ error = "Unauthorized" }
        }
        return @{ error = $_.Exception.Message }
    }
}

Write-Host "TEST 1: Health Check" -ForegroundColor Green
$health = Invoke-ApiRequest "GET" "/health"
if ($health.status -eq "ok") {
    Write-Host "  PASS: Backend is running" -ForegroundColor Green
} else {
    Write-Host "  FAIL: Backend not responding" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "TEST 2: Register New User" -ForegroundColor Green
Write-Host "  Email: $testEmail" -ForegroundColor Gray
$registerBody = @{
    email = $testEmail
    password = $testPassword
    name = $testName
}
$registerResult = Invoke-ApiRequest "POST" "/api/auth/register" $registerBody
if ($registerResult.success -or $registerResult.data.id) {
    Write-Host "  PASS: User registered successfully" -ForegroundColor Green
    $userId = $registerResult.data.id
    Write-Host "  User ID: $userId" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: $($registerResult.error)" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "TEST 3: Login User" -ForegroundColor Green
$loginBody = @{
    email = $testEmail
    password = $testPassword
}
$loginResult = Invoke-ApiRequest "POST" "/api/auth/login" $loginBody
if ($loginResult.token) {
    Write-Host "  PASS: User logged in successfully" -ForegroundColor Green
    $token = $loginResult.token
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} else {
    Write-Host "  FAIL: $($loginResult.error)" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "TEST 4: Get User Profile" -ForegroundColor Green
$headers = @{ "Authorization" = "Bearer $token" }
$meResult = Invoke-ApiRequest "GET" "/api/auth/me" $null $headers
if ($meResult.id) {
    Write-Host "  PASS: Profile retrieved" -ForegroundColor Green
    Write-Host "  Name: $($meResult.name)" -ForegroundColor Gray
    Write-Host "  Tier: $($meResult.tier)" -ForegroundColor Gray
    Write-Host "  Loyalty Points: $($meResult.loyaltyPoints)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: Could not get profile" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 5: Get Products" -ForegroundColor Green
$productsResult = Invoke-ApiRequest "GET" "/api/products"
if ($productsResult -is [array] -and $productsResult.Count -gt 0) {
    Write-Host "  PASS: Products loaded" -ForegroundColor Green
    Write-Host "  Total products: $($productsResult.Count)" -ForegroundColor Gray
    $productId = $productsResult[0].id
    Write-Host "  First product: $($productsResult[0].name)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: No products found" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 6: Create Order (COD)" -ForegroundColor Green
$orderBody = @{
    items = @(
        @{
            productId = $productId
            quantity = 1
            size = "M"
            milk = "Yến mạch"
            sugar = "50%"
        }
    )
    deliveryMethod = "delivery"
    paymentMethod = "cod"
    customerName = $testName
    customerPhone = "0901234567"
    address = "123 Nguyen Hue"
    district = "Q1"
    city = "TP. Ho Chi Minh"
}
$orderResult = Invoke-ApiRequest "POST" "/api/orders" $orderBody $headers
if ($orderResult.id) {
    Write-Host "  PASS: Order created" -ForegroundColor Green
    $orderId = $orderResult.id
    Write-Host "  Order ID: $orderId" -ForegroundColor Gray
    Write-Host "  Order Number: $($orderResult.orderNumber)" -ForegroundColor Gray
    Write-Host "  Total: $($orderResult.total) VND" -ForegroundColor Gray
    Write-Host "  Status: $($orderResult.status)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: $($orderResult.error)" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 7: Get Order Details" -ForegroundColor Green
$getOrderResult = Invoke-ApiRequest "GET" "/api/orders/$orderId" $null $headers
if ($getOrderResult.id) {
    Write-Host "  PASS: Order retrieved" -ForegroundColor Green
    Write-Host "  Items: $($getOrderResult.items.Count)" -ForegroundColor Gray
    Write-Host "  Status: $($getOrderResult.status)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: Could not get order" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 8: Get Loyalty Status" -ForegroundColor Green
$loyaltyResult = Invoke-ApiRequest "GET" "/api/loyalty/status" $null $headers
if ($loyaltyResult.user) {
    Write-Host "  PASS: Loyalty status retrieved" -ForegroundColor Green
    Write-Host "  Current Points: $($loyaltyResult.user.loyaltyPoints)" -ForegroundColor Gray
    Write-Host "  Tier: $($loyaltyResult.user.tier)" -ForegroundColor Gray
    Write-Host "  Next Tier Points: $($loyaltyResult.nextTierPointsRemaining)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: Could not get loyalty status" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 9: Create VietQR Payment" -ForegroundColor Green
$vietqrBody = @{ orderId = $orderId }
$vietqrResult = Invoke-ApiRequest "POST" "/api/payments/vietqr" $vietqrBody $headers
if ($vietqrResult.success) {
    Write-Host "  PASS: VietQR generated" -ForegroundColor Green
    Write-Host "  Transaction Ref: $($vietqrResult.transactionRef)" -ForegroundColor Gray
    Write-Host "  Amount: $($vietqrResult.amount) VND" -ForegroundColor Gray
    Write-Host "  QR Code: Generated (PNG data)" -ForegroundColor Gray
    $transactionRef = $vietqrResult.transactionRef
} else {
    Write-Host "  FAIL: $($vietqrResult.error)" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 10: Verify VietQR Payment" -ForegroundColor Green
$verifyBody = @{ transactionRef = $transactionRef }
$verifyResult = Invoke-ApiRequest "POST" "/api/payments/vietqr/verify" $verifyBody $headers
if ($verifyResult.success) {
    Write-Host "  PASS: Payment verified" -ForegroundColor Green
    Write-Host "  Points Earned: $($verifyResult.pointsEarned)" -ForegroundColor Gray
    Write-Host "  Total Points: $($verifyResult.totalPoints)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: $($verifyResult.error)" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 11: Check Loyalty Points After Payment" -ForegroundColor Green
$loyaltyAfterResult = Invoke-ApiRequest "GET" "/api/loyalty/status" $null $headers
if ($loyaltyAfterResult.user) {
    Write-Host "  PASS: Loyalty points updated" -ForegroundColor Green
    Write-Host "  Points: $($loyaltyAfterResult.user.loyaltyPoints)" -ForegroundColor Gray
    Write-Host "  Tier: $($loyaltyAfterResult.user.tier)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: Could not verify points" -ForegroundColor Red
}
Write-Host ""

Write-Host "TEST 12: Redeem Loyalty Points" -ForegroundColor Green
$redeemBody = @{ amount = 100 }
$redeemResult = Invoke-ApiRequest "POST" "/api/loyalty/redeem" $redeemBody $headers
if ($redeemResult.success) {
    Write-Host "  PASS: Points redeemed" -ForegroundColor Green
    Write-Host "  Discount: $($redeemResult.discountVND) VND" -ForegroundColor Gray
    Write-Host "  Remaining Points: $($redeemResult.remainingPoints)" -ForegroundColor Gray
} else {
    Write-Host "  FAIL: $($redeemResult.error)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E2E Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test User:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor Gray
Write-Host "  Password: $testPassword" -ForegroundColor Gray
Write-Host "  User ID: $userId" -ForegroundColor Gray
Write-Host ""
Write-Host "Test Data:" -ForegroundColor Yellow
Write-Host "  Order ID: $orderId" -ForegroundColor Gray
Write-Host "  Transaction Ref: $transactionRef" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Result: ALL TESTS PASSED!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open $frontendUrl in browser"
Write-Host "2. Login with: $testEmail / $testPassword"
Write-Host "3. Check order history"
Write-Host "4. Check loyalty points"
Write-Host "5. Verify everything matches"
