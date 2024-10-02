import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: any): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.db.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);

    if (!user || !(await bcrypt.compare(password, user[0].password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user[0].id,
      username: user[0].username,
    });

    return { message: 'Login successful', user: user[0], token };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, password, provider, role } = registerDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.db.query(
        'INSERT INTO users (username, password_hash, provider, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, provider, role],
      );
      return { error: false, message: 'Registration successful' };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
