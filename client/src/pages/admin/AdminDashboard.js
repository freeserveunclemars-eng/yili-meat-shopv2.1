import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ProductModal from '../../components/admin/ProductModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('取得分類失敗:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `/products/admin/all?search=${encodeURIComponent(searchTerm)}`
        : '/products/admin/all';
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('取得商品失敗:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('確定要刪除此商品嗎？')) {
      return;
    }

    try {
      await api.delete(`/products/admin/${id}`);
      fetchProducts();
      alert('商品已刪除');
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <h1>商品管理</h1>
          <div className="admin-actions">
            <button className="btn-logout" onClick={handleLogout}>
              登出
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜尋商品名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleAddProduct}>
            + 新增商品
          </button>
        </div>

        {loading ? (
          <div className="loading">載入中...</div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>分類</th>
                  <th>重量（公克）</th>
                  <th>價格</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      目前沒有商品
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td>
                        {product.image ? (
                          <img 
                            src={`http://localhost:5000${product.image}`} 
                            alt={product.name}
                            className="product-thumb"
                          />
                        ) : (
                          <div className="no-image">無圖片</div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category_name || '未分類'}</td>
                      <td>{product.weight}</td>
                      <td>NT$ {product.price}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditProduct(product)}
                          >
                            編輯
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

