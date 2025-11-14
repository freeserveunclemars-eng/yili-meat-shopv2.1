import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 4)); // 顯示前4個商品
      } catch (error) {
        console.error('取得商品失敗:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* Banner */}
      <section className="banner">
        <div className="banner-content">
          <h1>益利肉類食品</h1>
          <p>高質感、真材實料，傳承好味道</p>
          <Link to="/products" className="btn-primary">立即選購</Link>
        </div>
      </section>

      {/* 公司簡介 */}
      <section className="about-section">
        <div className="container">
          <h2>關於益利</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                益利專注於提供高品質的肉類食品，從傳統工藝到現代技術，
                我們堅持選用優質食材，用心製作每一款產品。
              </p>
              <div className="contact-info">
                <h3>聯絡我們</h3>
                <p>
                  <a href="tel:0988859395" className="phone-link">
                    📞 電話：0988859395
                  </a>
                </p>
                <p>
                  <a href="mailto:humblemars@gmail.com">
                    ✉️ Email：humblemars@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 熱門商品 */}
      <section className="featured-products">
        <div className="container">
          <h2>熱門商品</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/products/${product.id}`}>
                  <div className="product-image">
                    {product.image ? (
                      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                    ) : (
                      <div className="placeholder-image">無圖片</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-weight">{product.weight} 公克</p>
                    <p className="product-price">NT$ {product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="view-all">
            <Link to="/products" className="btn-secondary">查看所有商品</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

