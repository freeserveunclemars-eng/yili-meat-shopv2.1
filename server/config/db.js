const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yili_meat_shop',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 測試資料庫連線
pool.getConnection()
  .then(connection => {
    console.log('✅ 資料庫連線成功');
    connection.release();
  })
  .catch(error => {
    console.error('❌ 資料庫連線失敗:', error.message);
    console.error('請檢查：');
    console.error('1. MySQL 服務是否運行');
    console.error('2. .env 檔案中的資料庫設定是否正確');
    console.error('3. 資料庫 yili_meat_shop 是否存在');
  });

module.exports = pool;

