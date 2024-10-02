CREATE DATABASE product_sales;

USE product_sales;

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_produk VARCHAR(100) NOT NULL,
    harga_jual INT NOT NULL
);

INSERT INTO products (nama_produk, harga_jual)
VALUES
('combed 30s', 5000),
('combed 30s', 5500),
('combed 30s', 7000),
('combed 30s', 6000),
('combed 30s', 6500),
('combed 24s', 8000),
('combed 28s', 9500),
('combed 24s', 8500),
('combed 28s', 10000),
('combed 28s', 10500);

CREATE TABLE archived_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_produk VARCHAR(100) NOT NULL,
    harga_jual INT NOT NULL
);

CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO sales (product_id, customer_id, amount)
VALUES
(1, 1, 5000),
(2, 2, 5500),
(3, 3, 7000),
(4, 1, 6000),
(5, 2, 6500),
(6, 4, 8000),
(7, 5, 9500),
(8, 3, 8500),
(9, 4, 10000),
(10, 5, 10500);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_customer VARCHAR(100)
);

INSERT INTO customers (nama_customer)
VALUES
('John Doe'),
('Jane Smith'),
('Michael Brown'),
('Emily Davis'),
('Daniel Wilson')
