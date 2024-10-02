import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Cron } from '@nestjs/schedule';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  @Cron('* * * * *') // Runs every minute
  handleCron() {
    console.log('Task running every minute');
  }

  async saveTransaction(transactionData: CreateTransactionDto): Promise<any> {
    const connection = await this.db.getConnection();
    await connection.beginTransaction();
    try {
      const { customerId, productId, quantity } = transactionData;
      const product = await this.db.query(
        'SELECT harga_jual, stock FROM products WHERE id = ?',
        [productId],
      );
      if (product.length === 0) {
        throw new BadRequestException('Product not found.');
      }

      if (product[0].stock < quantity) {
        throw new BadRequestException('Insufficient stock.');
      }

      const amount = product[0].harga_jual * quantity;

      await this.db.query(
        'INSERT INTO sales (product_id, customer_id, amount, qty) VALUES (?, ?, ?, ?)',
        [productId, customerId, amount, quantity],
      );
      await this.db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [quantity, productId],
      );

      await connection.commit();
      return { message: 'Transaction executed successfully' };
    } catch (error) {
      await connection.rollback();
      throw new BadRequestException('Transaction failed: ' + error.message);
    } finally {
      connection.release();
    }
  }

  async getTopCustomer(): Promise<any> {
    return this.db.query(`
      SELECT customer_id, c.kota, c.nama_customer, SUM(amount) AS total_purchases
      FROM sales
      JOIN customers c ON sales.customer_id = c.id
      GROUP BY customer_id
      ORDER BY total_purchases DESC
      LIMIT 1
    `);
  }

  async getMostSoldProductPerCity(): Promise<any> {
    const result = await this.db.query(`
      SELECT c.kota, p.nama_produk, SUM(s.qty) as total_qty, SUM(s.amount) AS total_sold
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN products p ON s.product_id = p.id
      GROUP BY c.kota, p.nama_produk
      ORDER BY total_sold DESC
    `);

    if (result.length === 0) {
      throw new BadRequestException('No sales data found.');
    }

    const mostSoldProducts = result.reduce((acc: any, row: any) => {
      const { kota, nama_produk, total_qty, total_sold } = row;
      if (!acc[kota] || acc[kota].total_sold < total_sold) {
        acc[kota] = {
          nama_produk,
          total_sold: parseInt(total_sold),
          total_qty: parseInt(total_qty),
          kota,
        };
      }
      return acc;
    }, {});

    return Object.values(mostSoldProducts);
  }

  async getAverageProductsSold(): Promise<any> {
    const result = await this.db.query(`
        SELECT month, AVG(total_sold) AS average_sold
        FROM (
             SELECT MONTH(created_at) AS month, SUM(amount) AS total_sold
             FROM sales
             GROUP BY MONTH(created_at)
         ) AS monthly_sales
        GROUP BY month
    `);

    if (result.length === 0) {
      throw new BadRequestException('No sales data found.');
    }

    return result;
  }

  async getStockReport(): Promise<any> {
    const result = await this.db.query(`
      SELECT p.nama_produk, SUM(s.qty) AS total_transaksi, p.stock
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      GROUP BY p.id
    `);

    if (result.length === 0) {
      throw new BadRequestException('No stock data found.');
    }

    return result;
  }

  async getUserRequestsPerHour(): Promise<any[]> {
    return await this.db.query(
      `SELECT
           user_id,
           DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') AS hour,
           COUNT(*) AS request_count
       FROM
           user_requests
       GROUP BY
           user_id, hour
       ORDER BY
           hour DESC;`,
    );
  }
}
