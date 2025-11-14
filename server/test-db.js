// 資料庫連線測試腳本
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('正在測試資料庫連線...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'yili_meat_shop'
  };

  console.log('資料庫設定:');
  console.log(`  Host: ${config.host}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  Password: ${config.password ? '***' : '(空)'}\n`);

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ 資料庫連線成功！\n');

    // 檢查管理員表是否存在
    try {
      const [admins] = await connection.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
      
      if (admins.length > 0) {
        console.log('✅ 找到管理員帳號:');
        console.log(`   帳號: ${admins[0].username}`);
        console.log(`   密碼: ${admins[0].password === '12345' ? '12345 (預設)' : '已加密'}`);
      } else {
        console.log('⚠️  未找到管理員帳號');
        console.log('   請執行 database/schema.sql 來建立管理員帳號');
      }
    } catch (error) {
      console.log('⚠️  無法查詢管理員表:', error.message);
      console.log('   請確認已執行 database/schema.sql');
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 資料庫連線失敗！\n');
    console.error('錯誤訊息:', error.message);
    console.error('\n請檢查：');
    console.error('1. MySQL 服務是否運行');
    console.error('2. server/.env 檔案是否存在且設定正確');
    console.error('3. 資料庫名稱是否正確');
    console.error('4. 使用者名稱和密碼是否正確');
    console.error('5. 資料庫是否已建立（執行 database/schema.sql）');
    process.exit(1);
  }
}

testConnection();

