import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ChatGateway } from './chat/chat.gateway';
import { MessagesModule } from './chat/messages.module';
import { TaskModule } from './tasks/task.module';
import { DocumentsModule } from './documents/documents.module';
import { CloudDocumentModule } from './cloudDocument/cloud-document.module';
import { WhiteboardModule } from './whiteboard/whiteboard.module';


@Module({
  imports: [
    AuthModule,
    MessagesModule,
    TaskModule,
    DocumentsModule,
    CloudDocumentModule,
    WhiteboardModule
  ],
  providers: [AppService, ChatGateway],
  controllers: [AppController, AuthController,],
})
export class AppModule { }
