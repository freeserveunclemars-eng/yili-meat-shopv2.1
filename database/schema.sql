-- 益利肉類食品販售網站資料庫結構

CREATE DATABASE IF NOT EXISTS yili_meat_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yili_meat_shop;

-- 商品分類表
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '分類名稱（如：肉乾、香腸、魚鬆）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL COMMENT '商品名稱',
    category_id INT COMMENT '分類ID',
    image VARCHAR(500) COMMENT '商品圖片路徑',
    weight INT NOT NULL COMMENT '商品重量（公克）',
    price DECIMAL(10, 2) NOT NULL COMMENT '商品價格',
    description TEXT COMMENT '商品介紹',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 訂單表
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL COMMENT '客戶姓名',
    customer_phone VARCHAR(20) NOT NULL COMMENT '客戶電話',
    customer_email VARCHAR(200) COMMENT '客戶Email',
    customer_address TEXT COMMENT '客戶地址',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '訂單總額',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '訂單狀態',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 訂單明細表
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_weight INT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理員表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT '密碼（需加密）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入預設管理員（密碼：12345）
-- 注意：此為簡化版本，實際使用時應使用 bcrypt 加密
-- 後端登入邏輯會直接檢查密碼是否為 12345
-- 生產環境請務必更改密碼並使用加密儲存
INSERT INTO admins (username, password) VALUES 
('admin', '12345');

-- 插入範例分類
INSERT INTO categories (name) VALUES 
('肉乾'),
('香腸'),
('魚鬆'),
('其他');

-- 插入範例商品
INSERT INTO products (name, category_id, image, weight, price, description) VALUES 
('原味肉乾', 1, '/images/products/meat-dry-1.jpg', 200, 150.00, '精選優質豬肉，傳統工藝製作，口感Q彈有嚼勁'),
('辣味肉乾', 1, '/images/products/meat-dry-2.jpg', 200, 160.00, '微辣調味，層次豐富，適合喜歡重口味的朋友'),
('原味香腸', 2, '/images/products/sausage-1.jpg', 300, 200.00, '手工製作，真材實料，香氣四溢'),
('魚鬆', 3, '/images/products/fish-floss.jpg', 150, 120.00, '新鮮魚肉製成，口感細緻，營養豐富');

