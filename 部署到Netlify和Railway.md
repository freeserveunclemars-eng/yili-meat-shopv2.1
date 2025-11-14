# 部署到 Netlify + Railway 完整指南

## 📌 重要說明

**Netlify 只能部署前端，不能部署後端和資料庫！**

您的網站需要：
- ✅ **前端** → Netlify（可以）
- ❌ **後端 API** → 需要 Railway/Render（不能放在 Netlify）
- ❌ **資料庫** → 需要 Railway/Render（不能放在 Netlify）

## 🎯 完整部署架構

```
使用者瀏覽器
    ↓
Netlify（前端 React）
    ↓ API 請求
Railway（後端 Node.js）
    ↓
Railway MySQL（資料庫）
```

## 🚀 部署步驟

### 第一部分：部署後端到 Railway

#### 步驟 1：註冊 Railway

1. 前往：https://railway.app
2. 使用 GitHub 帳號登入
3. 授權 Railway 存取您的 GitHub

#### 步驟 2：建立新專案

1. 點擊「New Project」
2. 選擇「Deploy from GitHub repo」
3. 選擇您的專案儲存庫

#### 步驟 3：設定後端服務

1. Railway 會自動偵測到專案
2. 點擊專案，選擇「Settings」
3. 設定：
   - **Root Directory**：`server`
   - **Start Command**：`npm start`

#### 步驟 4：新增 MySQL 資料庫

1. 在專案中點擊「+ New」
2. 選擇「Database」→「Add MySQL」
3. Railway 會自動建立 MySQL 資料庫
4. 記下連線資訊（會在環境變數中自動設定）

#### 步驟 5：設定環境變數

在後端服務的「Variables」標籤中，新增：

```
JWT_SECRET=your-secret-key-change-this
PORT=5000
EMAIL_USER=humblemars@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**注意：** `DB_HOST`、`DB_USER`、`DB_PASSWORD`、`DB_NAME` 會由 Railway 自動設定（來自 MySQL 服務）

#### 步驟 6：初始化資料庫

1. 在 MySQL 服務中，點擊「Connect」
2. 使用提供的連線資訊
3. 執行 `database/schema.sql` 中的 SQL 語句
4. 或使用 Railway 的資料庫管理介面

#### 步驟 7：記下後端網址

部署完成後，Railway 會提供一個網址，例如：
```
https://your-app-name.railway.app
```

記下這個網址，稍後需要用到！

---

### 第二部分：部署前端到 Netlify

#### 步驟 1：準備前端建置

確保 `client/package.json` 有建置腳本：

```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

#### 步驟 2：修改 API 設定

在 `client/src/utils/api.js` 中：

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

這會自動使用環境變數，如果沒有設定則使用本地開發網址。

#### 步驟 3：部署到 Netlify

1. 前往：https://app.netlify.com
2. 點擊「Add new site」→「Import an existing project」
3. 選擇「GitHub」
4. 選擇您的儲存庫
5. 設定建置選項：
   - **Base directory**：`client`
   - **Build command**：`npm install && npm run build`
   - **Publish directory**：`client/build`

#### 步驟 4：設定環境變數

在 Netlify 的「Site settings」→「Environment variables」中，新增：

```
REACT_APP_API_URL=https://your-app-name.railway.app/api
```

**重要：** 將 `your-app-name.railway.app` 替換為您實際的 Railway 後端網址！

#### 步驟 5：更新 CORS 設定

修改 `server/index.js`，允許 Netlify 網域的請求：

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-site.netlify.app'
  ],
  credentials: true
}));
```

在 Railway 的環境變數中新增：
```
FRONTEND_URL=https://your-site.netlify.app
```

---

## ✅ 部署後檢查清單

### 後端（Railway）

- [ ] 後端服務正在運行
- [ ] 資料庫已建立並匯入結構
- [ ] 環境變數已設定
- [ ] API 可以訪問（測試：`https://your-app.railway.app/api/health`）

### 前端（Netlify）

- [ ] 前端已成功建置
- [ ] 環境變數 `REACT_APP_API_URL` 已設定
- [ ] 網站可以正常訪問
- [ ] 可以連接到後端 API

### 功能測試

- [ ] 可以瀏覽商品列表
- [ ] 可以查看商品詳情
- [ ] 可以加入購物車
- [ ] 可以送出訂單
- [ ] 後台可以登入
- [ ] 後台可以管理商品

---

## 🔧 常見問題

### Q: 前端無法連接到後端？

**A:** 檢查：
1. `REACT_APP_API_URL` 是否正確設定
2. 後端 CORS 是否允許前端網域
3. 瀏覽器開發者工具的 Network 標籤查看錯誤

### Q: 資料庫連線失敗？

**A:** 檢查：
1. Railway 的 MySQL 服務是否運行
2. 環境變數是否正確（Railway 會自動設定）
3. 資料庫是否已建立並匯入結構

### Q: 圖片無法顯示？

**A:** 目前圖片上傳到本地目錄，部署時需要：
- 使用雲端儲存（AWS S3、Cloudinary）
- 或使用 Railway 的持久化儲存

### Q: Email 無法發送？

**A:** 檢查：
1. `EMAIL_USER` 和 `EMAIL_PASS` 是否正確
2. Gmail 應用程式密碼是否正確
3. 生產環境可能需要不同的 SMTP 設定

---

## 📝 部署後的功能

部署完成後，所有功能都可以正常使用：

✅ **前台功能**
- 瀏覽商品
- 加入購物車
- 送出訂單
- Email 通知

✅ **後台功能**
- 登入系統
- 商品管理
- 圖片上傳

**因為：**
- 前端在 Netlify（可以正常運行 React）
- 後端在 Railway（可以正常運行 Node.js API）
- 資料庫在 Railway（可以正常儲存資料）

---

## 🎉 完成！

部署完成後，您的網站就可以在網際網路上運行了！

**前端網址：** `https://your-site.netlify.app`  
**後端 API：** `https://your-app.railway.app/api`

需要我協助建立部署配置檔案嗎？

