import { Controller, Post, Body, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('transaction')
  async createTransaction(
    @Body()
    transactionData: CreateTransactionDto,
  ) {
    return this.tasksService.saveTransaction(transactionData);
  }

  @Get('report/top-customer')
  async getTopCustomer() {
    return this.tasksService.getTopCustomer();
  }

  @Get('report/most-sold-product-per-city')
  async getMostSoldProductPerCity() {
    return this.tasksService.getMostSoldProductPerCity();
  }

  @Get('report/average-products-sold')
  async getAverageProductsSold() {
    return this.tasksService.getAverageProductsSold();
  }

  @Get('report/stock')
  async getStockReport() {
    return await this.tasksService.getStockReport();
  }

  @Get('report/user-requests-per-hour')
  async getUserRequestsPerHour() {
    return await this.tasksService.getUserRequestsPerHour();
  }
}
