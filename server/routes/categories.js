const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 取得所有分類
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: '取得分類列表失敗' });
  }
});

module.exports = router;

