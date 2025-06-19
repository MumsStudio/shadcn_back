import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) { }

  async findAll(email: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { creator: email },
          {
            members: {
              some: {
                email: email
              }
            }
          }
        ]
      },
      include: { members: true }
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: { members: true, teams: true }
    });
  }

  async create(data: any): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null
      }
    });

    // 添加创建者到项目成员表
    await this.prisma.projectMember.create({
      data: {
        projectId: project.id,
        email: data.creator,
        role: 'owner'
      }
    });

    return project;
  }

  async update(id: string, data: any): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data
    });
  }

  async remove(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id }
    });
  }
}