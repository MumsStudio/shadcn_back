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

  async findOne(id: string, email: string): Promise<any | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { members: true, teams: { include: { lists: true } } }
    });

    if (!project ||
      (project.creator !== email &&
        !project.members.some(member => member.email === email))) {
      return { message: '您没有权限查看', errCode: 403 };
    }

    return project;
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
      data: {
        ...data,
        deadline: data.deadline? new Date(data.deadline) : null
      }
    });
  }

  async remove(id: string): Promise<Project> {
    // 先删除关联的ProjectMember
    await this.prisma.projectMember.deleteMany({
      where: { projectId: id }
    });

    // 删除关联的ProjectTeam及其ProjectList
    const teams = await this.prisma.projectTeam.findMany({
      where: { projectId: id },
      select: { id: true }
    });

    for (const team of teams) {
      await this.prisma.projectList.deleteMany({
        where: { projectTeamId: team.id }
      });
    }

    await this.prisma.projectTeam.deleteMany({
      where: { projectId: id }
    });

    // 最后删除Project
    return this.prisma.project.delete({
      where: { id }
    });
  }
}