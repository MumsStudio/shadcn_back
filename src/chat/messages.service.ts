import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Message } from '../../prisma/client';

export interface MessageData {
  content: string;
  timestamp: Date;
}

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async saveMessage(sender: string, receiver: string, messageData: MessageData) {
    return this.prisma.message.create({
      data: {
        sender,
        receiver,
        content: messageData.content,
        timestamp: messageData.timestamp
      }
    });
  }

  async getMessagesBetweenUsers(user1: string, user2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 }
        ]
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
  }

  async getLatestMessageByEmail(email: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { sender: email },
          { receiver: email }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    const latestMessages = new Map<string, Message>();

    messages.forEach(message => {
      const otherUser = message.sender === email ? message.receiver : message.sender;
      if (!latestMessages.has(otherUser) ||
        message.timestamp > latestMessages.get(otherUser).timestamp) {
        latestMessages.set(otherUser, message);
      }
    });

    return Array.from(latestMessages.values());
  }
}