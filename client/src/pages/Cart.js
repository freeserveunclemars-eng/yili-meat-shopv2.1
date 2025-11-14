import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>購物車</h1>
          <div className="empty-cart">
            <p>購物車是空的</p>
            <Link to="/products" className="btn-primary">前往選購</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>購物車</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">無圖片</div>
                  )}
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-weight">{item.weight} 公克</p>
                  <p className="item-price">NT$ {item.price}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-subtotal">
                  <p>NT$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  刪除
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>訂單摘要</h2>
            <div className="summary-row">
              <span>商品總數：</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
            </div>
            <div className="summary-row total">
              <span>總金額：</span>
              <span>NT$ {getTotalPrice().toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              確認送出訂單
            </button>
            <button 
              className="clear-cart-btn"
              onClick={clearCart}
            >
              清空購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

