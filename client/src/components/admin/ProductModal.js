import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './ProductModal.css';

const ProductModal = ({ product, categories, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    weight: '',
    price: '',
    description: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        weight: product.weight || '',
        price: product.price || '',
        description: product.description || '',
        image: null
      });
      setPreviewImage(product.image ? `http://localhost:5000${product.image}` : null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // 預覽圖片
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.weight || !formData.price) {
      setError('請填寫必填欄位（名稱、重量、價格）');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category_id', formData.category_id || '');
      submitData.append('weight', formData.weight);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description || '');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (product && !formData.image) {
        submitData.append('current_image', product.image || '');
      }

      if (product) {
        // 更新商品
        await api.put(`/products/admin/${product.id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('商品已更新');
      } else {
        // 新增商品
        await api.post('/products/admin', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('商品已新增');
      }

      onClose();
    } catch (error) {
      console.error('儲存商品失敗:', error);
      setError(error.response?.data?.error || '儲存失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? '編輯商品' : '新增商品'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">商品名稱 <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="請輸入商品名稱"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">分類</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">請選擇分類</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">重量（公克） <span className="required">*</span></label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="1"
                placeholder="例如：200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">價格 <span className="required">*</span></label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="例如：150.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">商品介紹</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="請輸入商品介紹（選填）"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">商品圖片</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="預覽" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

