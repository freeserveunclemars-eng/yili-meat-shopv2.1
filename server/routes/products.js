const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// 前台：取得所有商品（含分類篩選）
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (category_id) {
      query += ' WHERE p.category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await db.execute(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: '取得商品列表失敗' });
  }
});

// 前台：取得單一商品詳情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: '取得商品詳情失敗' });
  }
});

// 後台：取得所有商品（管理用）
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (search) {
      query += ' WHERE p.name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await db.execute(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: '取得商品列表失敗' });
  }
});

// 後台：新增商品
router.post('/admin', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, category_id, weight, price, description } = req.body;
    
    if (!name || !weight || !price) {
      return res.status(400).json({ error: '請填寫必填欄位（名稱、重量、價格）' });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    const [result] = await db.execute(
      `INSERT INTO products (name, category_id, image, weight, price, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category_id || null, imagePath, parseInt(weight), parseFloat(price), description || null]
    );

    const [newProduct] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: '新增商品失敗' });
  }
});

// 後台：更新商品
router.put('/admin/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, weight, price, description, current_image } = req.body;

    // 檢查商品是否存在
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }

    let imagePath = current_image || existing[0].image;
    if (req.file) {
      // 刪除舊圖片
      if (existing[0].image) {
        const oldImagePath = path.join(__dirname, '..', existing[0].image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    await db.execute(
      `UPDATE products 
       SET name = ?, category_id = ?, image = ?, weight = ?, price = ?, description = ? 
       WHERE id = ?`,
      [
        name || existing[0].name,
        category_id || null,
        imagePath,
        parseInt(weight) || existing[0].weight,
        parseFloat(price) || existing[0].price,
        description || null,
        id
      ]
    );

    const [updated] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: '更新商品失敗' });
  }
});

// 後台：刪除商品
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 取得商品資訊（包含圖片路徑）
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // 刪除商品圖片
    if (products[0].image) {
      const imagePath = path.join(__dirname, '..', products[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 刪除商品
    await db.execute('DELETE FROM products WHERE id = ?', [id]);

    res.json({ success: true, message: '商品已刪除' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: '刪除商品失敗' });
  }
});

module.exports = router;

