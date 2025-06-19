import { Module } from '@nestjs/common';
import { ProjectListController } from './project-list.controller';
import { ProjectListService } from './project-list.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProjectListController],
  providers: [ProjectListService, PrismaService],
})
export class ProjectListModule { }