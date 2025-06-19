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

  async remove(projectId: string, id: string): Promise<any> {
    // 首先检查项目team数组中是否存在该成员
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { teams: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const memberExists = project.teams.some(team =>
      team.members.some(member => member.id === id)
    );

    if (memberExists) {
      return { message: "必须先退出项目所在小组才可退出项目" };
    }

    // 然后执行删除操作
    return this.prisma.projectMember.delete({
      where: { id, projectId }
    });
  }
}