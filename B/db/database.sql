CREATE DATABASE IF NOT EXISTS product_trx;

USE product_trx;

CREATE TABLE IF NOT EXISTS users (
   id INT PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(100) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   provider VARCHAR(50) DEFAULT 'local', -- e.g., 'local', 'google'
   role VARCHAR(50) NOT NULL, -- e.g., 'admin', 'user'
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_produk VARCHAR(255) NOT NULL,
  harga_jual DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
   id INT PRIMARY KEY AUTO_INCREMENT,
   nama_customer VARCHAR(255) NOT NULL,
   kota VARCHAR(100) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
   id INT PRIMARY KEY AUTO_INCREMENT,
   product_id INT NOT NULL,
   customer_id INT NOT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   qty INT NOT NULL DEFAULT 1,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (product_id) REFERENCES products(id),
   FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS user_requests (
   id INT PRIMARY KEY AUTO_INCREMENT,
   user_id INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password_hash, provider, role)
VALUES
('john_doe', 'hashed_password1', 'local', 'user'),
('jane_smith', 'hashed_password2', 'google', 'user');

INSERT INTO customers (nama_customer, kota)
VALUES
('John Doe', 'Jakarta'),
('Jane Smith', 'Bandung');

INSERT INTO products (nama_produk, harga_jual, stock)
VALUES
('Product A', 10000, 100),
('Product B', 15000, 100);

INSERT INTO sales (product_id, customer_id, amount, qty)
VALUES
(1, 1, 10000, 5),
(2, 2, 15000, 1);

