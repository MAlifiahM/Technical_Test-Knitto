use product_sales;

#Answer 1
INSERT INTO archived_products (nama_produk, harga_jual)
SELECT products.nama_produk, products.harga_jual FROM product_sales.products;

#Answer 2
SELECT nama_produk, SUM(harga_jual) as total_sales FROM products GROUP BY nama_produk;

#Answer 3
SELECT c.nama_customer, p.nama_produk, s.amount
FROM sales s
JOIN customers c ON s.customer_id = c.id
JOIN products p ON s.product_id = p.id
WHERE s.amount = (
    SELECT MAX(amount)
    FROM sales
    WHERE product_id = p.id
    );

#Answer 4
SELECT p1.id, p1.nama_produk, p1.harga_jual
FROM products p1
WHERE p1.id = (
    SELECT MAX(p2.id)
    FROM products p2
    WHERE p1.nama_produk = p2.nama_produk
);
