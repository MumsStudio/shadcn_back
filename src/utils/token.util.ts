import { BadRequestException } from '@nestjs/common';

export class TokenUtil {
  static extractEmailFromToken(token: string): string {
    if (!token) {
      throw new BadRequestException('无效的token');
    }

    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      if (!payload.email) {
        throw new BadRequestException('token中未包含email');
      }
      console.log("payload", payload);
      return payload.email;
    } catch (error) {
      throw new BadRequestException('token解析失败: ' + error.message);
    }
  }
}