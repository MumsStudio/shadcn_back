import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';



@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private clients: Map<string, Socket> = new Map();
  private userIdToSocket: Map<string, string> = new Map();
  private unreadMessages: Map<string, Array<{ sender: string, message: string, timestamp: string }>> = new Map();

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userIdToSocket.set(userId, client.id);
      if (this.unreadMessages.has(userId)) {
        const messages = this.unreadMessages.get(userId);
        if (messages && messages.length > 0) {
          client.emit('unread_messages', messages);
          this.unreadMessages.delete(userId);
        }
      }
    }
    console.log('Client connected', userId);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.userIdToSocket.delete(userId);
    }
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: any) {
    const userId = client.handshake.query.userId as string;
    console.log('Received message from:', userId, 'content:', data);
    console.log('Active clients:', this.clients.size);

    const { receiver, message, timestamp, sender } = data;
    const receiverSocketId = this.userIdToSocket.get(receiver);
    console.log('Receiver socket ID:', receiver);
    if (receiverSocketId && this.clients.has(receiverSocketId)) {
      this.clients.get(receiverSocketId).emit('message', {
        sender: sender,
        receiver: receiver,
        message,
        timestamp,
      });
      console.log('Message sent to:', receiver);
      client.emit('message_ack', { status: 'success', message: 'Message delivered' });
    } else {
      if (!this.unreadMessages.has(receiver)) {
        this.unreadMessages.set(receiver, []);
      }
      this.unreadMessages.get(receiver)?.push({
        sender,
        message,
        timestamp
      });
      client.emit('message_ack', {
        status: 'error',
        message: receiver ? 'Receiver not online, message saved as unread' : 'Invalid message format'
      });
    }
  }
}