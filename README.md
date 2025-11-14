# 益利肉類食品販售網站

## 專案簡介
高質感肉類食品販售網站，包含完整的前台購物功能與後台管理系統。

## 技術棧
- **前端**: React + React Router + CSS3
- **後端**: Node.js + Express
- **資料庫**: MySQL
- **Email**: Nodemailer (SMTP)

## 安裝步驟

### 1. 安裝所有依賴
```bash
npm run install-all
```

### 2. 設定資料庫
- 建立 MySQL 資料庫
- 執行 `database/schema.sql` 建立資料表
- 修改 `server/config/db.js` 中的資料庫連線設定

### 3. 設定 Email
- 修改 `server/config/email.js` 中的 SMTP 設定

### 4. 啟動開發伺服器
```bash
npm run dev
```

前端將在 http://localhost:3000 運行
後端 API 將在 http://localhost:5000 運行

## 功能說明

### 前台功能
- 首頁：Banner、公司簡介、快速購物入口
- 商品列表：分類篩選、加入購物車
- 商品詳情：圖片放大、數量選擇
- 購物車：修改數量、刪除商品、計算總額
- 訂單送出：填寫聯絡資訊、Email 通知

### 後台功能
- 登入系統（帳號：admin，密碼：12345）
- 商品管理：新增、編輯、刪除、查詢

## 聯絡資訊
- 電話：0988859395
- Email：humblemars@gmail.com

