import { Module } from '@nestjs/common';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, PrismaService],
})
export class ProjectMemberModule { }