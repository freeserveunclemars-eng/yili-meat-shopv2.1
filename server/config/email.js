const nodemailer = require('nodemailer');

// Email 設定（使用 Gmail SMTP）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'humblemars@gmail.com',
    pass: process.env.EMAIL_PASS || '' // 請設定 Gmail 應用程式密碼
  }
});

// 發送訂單通知 Email
async function sendOrderEmail(orderData) {
  const { customerName, customerPhone, customerEmail, customerAddress, items, totalAmount } = orderData;

  // 建立訂單明細 HTML
  let itemsHtml = '';
  items.forEach(item => {
    itemsHtml += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.weight} 公克</td>
        <td style="padding: 10px; border: 1px solid #ddd;">NT$ ${item.price}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">NT$ ${item.subtotal}</td>
      </tr>
    `;
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'humblemars@gmail.com',
    to: 'humblemars@gmail.com',
    subject: `【益利】新訂單通知 - ${customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">新訂單通知</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h3>客戶資訊</h3>
          <p><strong>姓名：</strong>${customerName}</p>
          <p><strong>電話：</strong>${customerPhone}</p>
          <p><strong>Email：</strong>${customerEmail || '未提供'}</p>
          <p><strong>地址：</strong>${customerAddress || '未提供'}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3>訂單明細</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #8B4513; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">商品名稱</th>
                <th style="padding: 10px; border: 1px solid #ddd;">重量</th>
                <th style="padding: 10px; border: 1px solid #ddd;">單價</th>
                <th style="padding: 10px; border: 1px solid #ddd;">數量</th>
                <th style="padding: 10px; border: 1px solid #ddd;">小計</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right;">
            <h3 style="color: #8B4513;">總金額：NT$ ${totalAmount}</h3>
          </div>
        </div>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          此為系統自動發送的訂單通知，請盡快與客戶聯絡確認訂單。
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error: ', error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendOrderEmail };

