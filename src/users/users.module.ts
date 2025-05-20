import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notifications/notification.module';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
  imports: [PrismaModule, ProfileModule, NotificationModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }