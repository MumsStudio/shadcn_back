import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
// import { Notification } from './notification.entity';
import { TokenUtil } from 'src/utils/token.util';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  async getByEmail(@Headers('Authorization') token: string): Promise<any | undefined> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.notificationService.findOrCreate(email);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Headers('Authorization') token: string,
    @Body() data: Partial<any>
  ): Promise<any> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.notificationService.update(email, data);
  }
}