import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../database/database.service'; // Adjust path as needed

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;

      await this.logUserRequest(decoded.id);
      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async logUserRequest(userId: number) {
    const timestamp = new Date();
    await this.db.query(
      'INSERT INTO user_requests (user_id, created_at) VALUES (?, ?)',
      [userId, timestamp],
    );
  }
}
