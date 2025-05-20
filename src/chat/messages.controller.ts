import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageData } from './messages.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  async createMessage(
    @Body() saveData: any,
  ) {
    const { sender, receiver, content, timestamp } = saveData;
    const messageData: MessageData = {
      content,
      timestamp,
    };
    return this.messagesService.saveMessage(sender, receiver, messageData);
  }

  @Get('between/:user1/:user2')
  @UseGuards(AuthGuard('jwt'))
  async getMessagesBetweenUsers(
    @Param('user1') user1: string,
    @Param('user2') user2: string
  ) {
    return this.messagesService.getMessagesBetweenUsers(user1, user2);
  }

  @Get('latest/:email')
  @UseGuards(AuthGuard('jwt'))
  async getLatestMessageByEmail(
    @Param('email') email: string
  ) {
    return this.messagesService.getLatestMessageByEmail(email);
  }
}