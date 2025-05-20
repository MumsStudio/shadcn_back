import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // 应与JwtModule中的一致
    });
  }

  async validate(payload: any) {
    // 验证JWT签名和过期时间
    if (!payload || !payload.email) {
      throw new Error('Invalid token payload: missing required fields');
    }

    // 检查token是否过期(由passport-jwt自动处理，因为ignoreExpiration设为false)

    return {
      email: payload.email,
    };
  }
}