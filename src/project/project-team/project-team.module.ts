import { Module } from '@nestjs/common';
import { ProjectTeamController } from './project-team.controller';
import { ProjectTeamService } from './project-team.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProjectTeamController],
  providers: [ProjectTeamService, PrismaService],
})
export class ProjectTeamModule { }