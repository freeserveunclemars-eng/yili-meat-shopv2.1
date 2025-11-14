import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('取得商品詳情失敗:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('商品已加入購物車！');
    }
  };

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  if (!product) {
    return <div className="error">商品不存在</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        
        <div className="product-detail">
          <div className="product-image-section">
            {product.image ? (
              <img 
                src={`http://localhost:5000${product.image}`} 
                alt={product.name}
                className="main-image"
              />
            ) : (
              <div className="placeholder-image">無圖片</div>
            )}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            {product.category_name && (
              <p className="category-tag">{product.category_name}</p>
            )}
            <p className="product-weight">重量：{product.weight} 公克</p>
            <p className="product-price">NT$ {product.price}</p>
            
            {product.description && (
              <div className="product-description">
                <h3>商品介紹</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="purchase-section">
              <div className="quantity-selector">
                <label>數量：</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

