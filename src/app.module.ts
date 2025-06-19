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
import { TableModule } from './table/table.module';
import { CollaborationGateway } from './collaboration/collaboration.gateway';
import { ProjectModule } from './project/project.module';
import { ProjectMemberModule } from './project/project-member/project-member.module';
import { ProjectTeamModule } from './project/project-team/project-team.module';
import { ProjectListModule } from './project/project-list/project-list.module';


@Module({
  imports: [
    AuthModule,
    MessagesModule,
    TaskModule,
    DocumentsModule,
    CloudDocumentModule,
    WhiteboardModule,
    TableModule,
    ProjectModule,
    ProjectMemberModule,
    ProjectTeamModule,
    ProjectListModule
  ],
  providers: [AppService, ChatGateway, CollaborationGateway],
  controllers: [AppController, AuthController,],
})
export class AppModule { }
