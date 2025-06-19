import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectList } from '@prisma/client';

@Injectable()
export class ProjectListService {
  constructor(private prisma: PrismaService) { }

  async findAll(projectTeamId: string): Promise<ProjectList[]> {
    return this.prisma.projectList.findMany({
      where: { projectTeamId: projectTeamId }
    });
  }

  async findOne(projectTeamId: string, id: string): Promise<ProjectList | null> {
    return this.prisma.projectList.findUnique({
      where: { id, projectTeamId: projectTeamId }
    });
  }

  async create(projectTeamId: string, data: any): Promise<ProjectList> {
    return this.prisma.projectList.create({
      data: { ...data, projectTeamId: projectTeamId }
    });
  }

  async update(projectTeamId: string, id: string, data: any): Promise<ProjectList> {
    return this.prisma.projectList.update({
      where: { id, projectTeamId: projectTeamId },
      data
    });
  }

  async remove(projectId: string, id: string): Promise<ProjectList> {
    return this.prisma.projectList.delete({
      where: { id, projectTeamId: projectId }
    });
  }
}