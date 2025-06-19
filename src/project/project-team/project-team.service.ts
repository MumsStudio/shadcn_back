import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectTeam } from '@prisma/client';

@Injectable()
export class ProjectTeamService {
  constructor(private prisma: PrismaService) { }

  async findAll(projectId: string): Promise<ProjectTeam[]> {
    return this.prisma.projectTeam.findMany({
      where: { projectId },
      include: { lists: true }
    });
  }

  async findOne(projectId: string, id: string): Promise<ProjectTeam | null> {
    return this.prisma.projectTeam.findUnique({
      where: { id, projectId },
      include: { lists: true }
    });
  }

  async create(projectId: string, data: any): Promise<ProjectTeam> {
    return this.prisma.projectTeam.create({
      data: { ...data, projectId }
    });
  }

  async update(projectId: string, id: string, data: any): Promise<ProjectTeam> {
    return this.prisma.projectTeam.update({
      where: { id, projectId },
      data
    });
  }

  async remove(projectId: string, id: string): Promise<ProjectTeam> {
    return this.prisma.projectTeam.delete({
      where: { id, projectId }
    });
  }
}