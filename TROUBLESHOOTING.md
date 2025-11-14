# 疑難排解指南

## 登入時出現「伺服器錯誤」

### 可能原因與解決方法

#### 1. 資料庫連線失敗 ⚠️ 最常見

**症狀**：
- 登入時顯示「伺服器錯誤」
- 後端控制台顯示資料庫連線錯誤

**解決方法**：

**步驟 1：檢查資料庫服務**
```bash
# 確認 MySQL 服務是否運行
# Windows: 在服務管理員中檢查 MySQL 服務
```

**步驟 2：檢查 .env 檔案**
在 `server` 目錄下確認是否有 `.env` 檔案，內容應包含：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密碼
DB_NAME=yili_meat_shop
JWT_SECRET=yili-secret-key-12345
PORT=5000
```

**步驟 3：測試資料庫連線**
```bash
cd server
npm run test-db
```

或執行：
```bash
node server/test-db.js
```

**步驟 4：確認資料庫已建立**
```sql
-- 在 MySQL 中執行
SHOW DATABASES;
-- 應該看到 yili_meat_shop
```

如果沒有，執行：
```bash
mysql -u root -p < database/schema.sql
```

#### 2. 資料庫中沒有管理員帳號

**症狀**：
- 資料庫連線成功
- 但登入時顯示「帳號或密碼錯誤」

**解決方法**：

**檢查管理員帳號是否存在**：
```sql
USE yili_meat_shop;
SELECT * FROM admins;
```

如果沒有資料，執行：
```sql
INSERT INTO admins (username, password) VALUES ('admin', '12345');
```

或重新執行 `database/schema.sql`

#### 3. JWT_SECRET 未設定

**症狀**：
- 登入時出現 JWT 相關錯誤

**解決方法**：
在 `server/.env` 中加入：
```env
JWT_SECRET=your-secret-key-here
```

#### 4. 依賴套件未安裝

**症狀**：
- 後端無法啟動
- 出現 `Cannot find module` 錯誤

**解決方法**：
```bash
cd server
npm install
```

## 快速診斷步驟

### 使用自動檢查工具

執行 `檢查設定.bat`，它會自動檢查：
- ✅ .env 檔案是否存在
- ✅ 依賴套件是否安裝
- ✅ 資料庫連線是否正常
- ✅ 管理員帳號是否存在
- ✅ 上傳目錄是否存在

### 手動檢查清單

- [ ] MySQL 服務正在運行
- [ ] `server/.env` 檔案存在且設定正確
- [ ] 資料庫 `yili_meat_shop` 已建立
- [ ] 已執行 `database/schema.sql`
- [ ] 後端依賴已安裝（`server/node_modules` 存在）
- [ ] 後端伺服器正在運行（http://localhost:5000）

## 查看詳細錯誤訊息

### 後端控制台

啟動後端伺服器時，查看控制台輸出：
- 如果有資料庫連線錯誤，會顯示詳細訊息
- 登入時如果有錯誤，會顯示錯誤堆疊

### 瀏覽器開發者工具

1. 按 F12 開啟開發者工具
2. 切換到「Network」（網路）標籤
3. 嘗試登入
4. 查看 `/api/auth/login` 請求的響應
5. 查看 Response（響應）中的錯誤訊息

## 常見錯誤訊息對照

| 錯誤訊息 | 可能原因 | 解決方法 |
|---------|---------|---------|
| `資料庫連線失敗` | MySQL 未運行或設定錯誤 | 檢查 MySQL 服務和 .env 設定 |
| `帳號或密碼錯誤` | 資料庫中沒有管理員帳號 | 執行 database/schema.sql |
| `Cannot find module` | 依賴未安裝 | 執行 `npm install` |
| `ECONNREFUSED` | 後端未啟動 | 啟動後端伺服器 |
| `JWT_SECRET is not defined` | 環境變數未設定 | 在 .env 中設定 JWT_SECRET |

## 測試資料庫連線

### 方法 1：使用測試腳本
```bash
cd server
npm run test-db
```

### 方法 2：使用 MySQL 命令列
```bash
mysql -u root -p -e "USE yili_meat_shop; SELECT * FROM admins;"
```

### 方法 3：檢查 API 健康狀態
訪問：http://localhost:5000/api/health

應該看到：
```json
{
  "status": "OK",
  "message": "益利肉類食品販售網站 API 運行中"
}
```

## 重新設定資料庫

如果資料庫有問題，可以重新建立：

```bash
# 1. 刪除舊資料庫（謹慎操作！）
mysql -u root -p -e "DROP DATABASE IF EXISTS yili_meat_shop;"

# 2. 重新建立
mysql -u root -p < database/schema.sql
```

## 需要更多幫助？

如果以上方法都無法解決問題，請提供：
1. 後端控制台的完整錯誤訊息
2. 瀏覽器開發者工具中的 Network 響應
3. `.env` 檔案內容（隱藏密碼）
4. 資料庫連線測試結果

