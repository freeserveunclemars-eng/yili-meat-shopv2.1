import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>益利</h3>
            <p>高質感肉類食品專賣</p>
          </div>
          <div className="footer-section">
            <h4>聯絡我們</h4>
            <p>
              <a href="tel:0988859395" className="phone-link">電話：0988859395</a>
            </p>
            <p>
              <a href="mailto:humblemars@gmail.com">Email：humblemars@gmail.com</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 益利. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

