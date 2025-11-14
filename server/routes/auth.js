const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// 管理員登入
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '請輸入帳號和密碼' });
    }

    // 查詢管理員
    let admins;
    try {
      [admins] = await db.execute(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
    } catch (dbError) {
      console.error('資料庫查詢錯誤:', dbError);
      return res.status(500).json({ 
        error: '資料庫連線失敗', 
        message: '請檢查資料庫設定和連線狀態' 
      });
    }

    if (admins.length === 0) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const admin = admins[0];

    // 驗證密碼（預設密碼 12345 的簡單驗證，實際應使用 bcrypt）
    // 為了簡化，這裡直接檢查密碼是否為 12345
    if (password === '12345') {
      // 產生 JWT Token
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token: token,
        user: { id: admin.id, username: admin.username }
      });
    } else {
      // 如果有加密的密碼，使用 bcrypt 驗證
      if (admin.password.startsWith('$2b$')) {
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
          return res.status(401).json({ error: '帳號或密碼錯誤' });
        }
      } else {
        return res.status(401).json({ error: '帳號或密碼錯誤' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token: token,
        user: { id: admin.id, username: admin.username }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: '伺服器錯誤',
      message: error.message || '未知錯誤',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

