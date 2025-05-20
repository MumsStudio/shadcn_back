import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    public jwtService: JwtService,
    private jwtStrategy: JwtStrategy
  ) {

  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log("user", user);
    const res = await this.validateUser(user.email, user.password);

    if (!res) {
      return { code: 401, message: '用户名或密码错误' };
    }

    const payload = {
      email: user.email,
      userId: user.id,
    };
    const options = {
      secret: process.env.JWT_SECRET// 应该从环境变量中获取
    };

    return {
      code: 200,
      access_token: this.jwtService.sign(payload, options),
      message: '登录成功',
      email: user.email,
    };
  }

  async register(email: string, password: string) {
    try {
      const user = await this.usersService.createUser(email, password);
      return {
        code: 200,
        message: '注册成功',
        email: user.email,
      };
    } catch (error) {
      return {
        code: 409,
        message: error.message || '注册失败',
      };
    }
  }
}