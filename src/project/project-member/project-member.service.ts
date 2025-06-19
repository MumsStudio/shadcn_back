import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectMember } from '@prisma/client';

@Injectable()
export class ProjectMemberService {
  constructor(private prisma: PrismaService) { }

  async findAll(projectId: string): Promise<ProjectMember[]> {
    return this.prisma.projectMember.findMany({
      where: { projectId }
    });
  }

  async findOne(projectId: string, id: string): Promise<ProjectMember | null> {
    return this.prisma.projectMember.findUnique({
      where: { id, projectId }
    });
  }

  async create(projectId: string, data: any): Promise<ProjectMember> {
    return this.prisma.projectMember.create({
      data: { ...data, projectId }
    });
  }

  async update(projectId: string, id: string, data: any): Promise<ProjectMember> {
    return this.prisma.projectMember.update({
      where: { id, projectId },
      data
    });
  }

  async remove(projectId: string, id: string): Promise<ProjectMember> {
    return this.prisma.projectMember.delete({
      where: { id, projectId }
    });
  }
}