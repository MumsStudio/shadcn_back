import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Adjust path as needed

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  async findOrCreate(email: string) {
    let notification = await this.prisma.notification.findFirst({
      where: { email },
    });

    if (!notification) {
      notification = await this.prisma.notification.create({
        data: {
          email,
          type: 'ALL',
          mobile: false,
          communicationEmails: false,
          socialEmails: false,
          marketingEmails: false,
          securityEmails: true,
        },
      });
    }

    return notification;
  }

  async update(email: string, data: any) {
    const notification = await this.findOrCreate(email);
    return this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        ...data,
      },
    });
  }
}