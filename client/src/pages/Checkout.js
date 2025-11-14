import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 驗證必填欄位
    if (!formData.customerName || !formData.customerPhone) {
      setError('請填寫姓名和電話');
      return;
    }

    if (cartItems.length === 0) {
      setError('購物車是空的');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || 'humblemars@gmail.com',
        customerAddress: formData.customerAddress,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        clearCart();
        alert('訂單已送出！我們會盡快與您聯絡。');
        navigate('/');
      }
    } catch (error) {
      console.error('送出訂單失敗:', error);
      setError('送出訂單失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>訂單送出</h1>
          <div className="empty-cart">
            <p>購物車是空的，無法送出訂單</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              前往選購
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>訂單送出</h1>
        
        <div className="checkout-content">
          <div className="order-summary">
            <h2>訂單明細</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    <span>{item.weight} 公克</span>
                    <span>NT$ {item.price} × {item.quantity}</span>
                  </div>
                  <div className="item-total">NT$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>總金額：</span>
              <span>NT$ {getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>聯絡資訊</h2>
            
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="customerName">姓名 <span className="required">*</span></label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="請輸入您的姓名"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">電話 <span className="required">*</span></label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                placeholder="請輸入您的電話"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="請輸入您的 Email（選填）"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerAddress">地址</label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows="3"
                placeholder="請輸入您的地址（選填）"
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? '送出中...' : '確認送出訂單'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

