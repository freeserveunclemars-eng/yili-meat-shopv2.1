# 快速開始指南

## 5 分鐘快速啟動

### 1. 安裝依賴
```bash
npm run install-all
```

### 2. 設定資料庫
```bash
# 建立資料庫
mysql -u root -p -e "CREATE DATABASE yili_meat_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 匯入結構
mysql -u root -p yili_meat_shop < database/schema.sql
```

### 3. 設定環境變數
在 `server` 目錄建立 `.env` 檔案：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yili_meat_shop
JWT_SECRET=your-secret-key
EMAIL_USER=humblemars@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=5000
```

### 4. 建立上傳目錄
```bash
mkdir -p server/uploads/products
```

### 5. 啟動伺服器
```bash
npm run dev
```

## 訪問網址

- **前台**: http://localhost:3000
- **後台**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api

## 預設帳號

- **帳號**: admin
- **密碼**: 12345

## 主要功能

### 前台
- 瀏覽商品
- 加入購物車
- 送出訂單（自動發送 Email）

### 後台
- 商品管理（新增/編輯/刪除）
- 商品搜尋

## 常見問題

**Q: 資料庫連線失敗？**
A: 檢查 `.env` 中的資料庫設定

**Q: Email 發送失敗？**
A: 需要設定 Gmail 應用程式密碼

**Q: 圖片無法上傳？**
A: 確認 `server/uploads/products` 目錄存在且有寫入權限

