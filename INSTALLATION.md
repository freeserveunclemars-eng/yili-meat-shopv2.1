# 益利肉類食品販售網站 - 安裝指南

## 前置需求

- Node.js (v14 或以上)
- MySQL (v5.7 或以上)
- npm 或 yarn

## 安裝步驟

### 1. 安裝所有依賴套件

在專案根目錄執行：

```bash
npm run install-all
```

這會自動安裝根目錄、server 和 client 的所有依賴。

### 2. 設定資料庫

1. 建立 MySQL 資料庫：

```sql
CREATE DATABASE yili_meat_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 執行資料庫結構腳本：

```bash
mysql -u root -p yili_meat_shop < database/schema.sql
```

或使用 MySQL Workbench 等工具執行 `database/schema.sql` 檔案。

### 3. 設定後端環境變數

在 `server` 目錄下建立 `.env` 檔案：

```env
# 資料庫設定
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yili_meat_shop

# JWT 密鑰（請更改為隨機字串）
JWT_SECRET=your-secret-key-here

# Email 設定（Gmail SMTP）
EMAIL_USER=humblemars@gmail.com
EMAIL_PASS=your-gmail-app-password

# 伺服器端口
PORT=5000
```

**重要：Gmail 應用程式密碼設定**

1. 前往 Google 帳戶設定
2. 啟用兩步驟驗證
3. 產生應用程式專用密碼
4. 將產生的密碼填入 `EMAIL_PASS`

### 4. 建立上傳目錄

```bash
mkdir -p server/uploads/products
```

### 5. 啟動開發伺服器

在專案根目錄執行：

```bash
npm run dev
```

這會同時啟動：
- 後端 API：http://localhost:5000
- 前端應用：http://localhost:3000

### 6. 單獨啟動（可選）

**只啟動後端：**
```bash
npm run server
```

**只啟動前端：**
```bash
npm run client
```

## 預設管理員帳號

- 帳號：`admin`
- 密碼：`12345`

**重要：** 上線前請務必更改預設密碼！

## 功能測試

### 前台功能
1. 瀏覽商品列表：http://localhost:3000/products
2. 查看商品詳情
3. 加入購物車
4. 送出訂單

### 後台功能
1. 登入後台：http://localhost:3000/admin/login
2. 新增商品
3. 編輯商品
4. 刪除商品
5. 搜尋商品

## 生產環境部署

### 建置前端

```bash
cd client
npm run build
```

建置後的檔案會在 `client/build` 目錄。

### 設定生產環境

1. 修改 `.env` 中的資料庫和 Email 設定
2. 確保 `JWT_SECRET` 是安全的隨機字串
3. 設定適當的檔案上傳限制
4. 配置 HTTPS

## 疑難排解

### 資料庫連線失敗
- 檢查 MySQL 服務是否運行
- 確認 `.env` 中的資料庫設定正確
- 確認資料庫使用者有足夠權限

### Email 發送失敗
- 確認 Gmail 應用程式密碼正確
- 檢查是否啟用兩步驟驗證
- 確認網路連線正常

### 圖片上傳失敗
- 確認 `server/uploads/products` 目錄存在
- 檢查目錄權限
- 確認檔案大小不超過 5MB

## 聯絡資訊

如有問題，請聯絡：
- Email: humblemars@gmail.com
- 電話: 0988859395

