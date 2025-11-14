const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { sendOrderEmail } = require('../config/email');

// 建立訂單
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, customerAddress, items } = req.body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: '請填寫必填欄位並至少選擇一項商品' });
    }

    // 計算總金額
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (products.length === 0) {
        return res.status(400).json({ error: `商品 ID ${item.productId} 不存在` });
      }

      const product = products[0];
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productWeight: product.weight,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // 建立訂單
    const [orderResult] = await db.execute(
      `INSERT INTO orders (customer_name, customer_phone, customer_email, customer_address, total_amount) 
       VALUES (?, ?, ?, ?, ?)`,
      [customerName, customerPhone, customerEmail || null, customerAddress || null, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 建立訂單明細
    for (const item of orderItems) {
      await db.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_weight, product_price, quantity, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.productWeight, item.productPrice, item.quantity, item.subtotal]
      );
    }

    // 發送 Email 通知
    const emailData = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || '未提供',
      customerAddress: customerAddress || '未提供',
      items: orderItems,
      totalAmount: totalAmount.toFixed(2)
    };

    const emailResult = await sendOrderEmail(emailData);

    res.status(201).json({
      success: true,
      orderId: orderId,
      message: '訂單已建立',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: '建立訂單失敗' });
  }
});

module.exports = router;

