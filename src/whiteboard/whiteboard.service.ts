import { WhiteBoard } from './../../node_modules/.pnpm/@prisma+client@6.7.0_typescript@5.8.3/node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWhiteboardDto } from './dto/create-whiteboard.dto';
import { UpdateWhiteboardDto } from './dto/update-whiteboard.dto';

@Injectable()
export class WhiteboardService {
  constructor(private prisma: PrismaService) { }

  async create(createWhiteboardDto: CreateWhiteboardDto, email) {
    return this.prisma.whiteBoard.create({
      data: {
        name: createWhiteboardDto.name,
        ownerEmail: email,
        nodes: createWhiteboardDto.nodes || [],
        edges: createWhiteboardDto.edges || [],
      },
    });
  }

  async findAll(ownerEmail: string) {
    return this.prisma.whiteBoard.findMany(
      { where: { ownerEmail } },
    );
  }

  async findOne(id: string) {
    return this.prisma.whiteBoard.findUnique({
      where: { id },
      include: {
        history: true,
        permissions: true,
        fileLibrary: true,
      },
    });
  }

  async update(id: string, updateWhiteboardDto: UpdateWhiteboardDto, email: string) {
    // 检查用户是否有权限编辑白板
    const whiteboard = await this.prisma.whiteBoard.findUnique({
      where: { id },
      include: { permissions: true }
    });

    if (!whiteboard) {
      throw new Error('白板不存在');
    }

    // 检查是否是白板拥有者或有编辑权限
    const hasPermission = whiteboard.ownerEmail === email ||
      whiteboard.permissions.some(p => p.userEmail === email && p.permission === 'EDIT');

    if (!hasPermission) {
      throw new Error('您没有权限编辑此白板');
    }
    await this.prisma.WhiteBoardHistory.create({
      data: {
        name: whiteboard.name,
        nodes: whiteboard.nodes,
        edges: whiteboard.edges,
        version: whiteboard.version,
        editedBy: email,
        whiteBoard: {
          connect: { id }
        }
      }
    });
    return this.prisma.whiteBoard.update({
      where: { id },
      data: {
        name: updateWhiteboardDto.name,
        nodes: updateWhiteboardDto.nodes,
        edges: updateWhiteboardDto.edges,
        lastEditedAt: new Date(),
        lastEditedBy: email,
        version: { increment: 1 },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction([
      this.prisma.whiteBoardHistory.deleteMany({
        where: { whiteBoardId: id }
      }),
      this.prisma.whiteBoardPermission.deleteMany({
        where: { whiteBoardId: id }
      }),
      this.prisma.whiteBoard.delete({
        where: { id }
      })
    ]);
  }
  async getHistory(id: string) {
    return this.prisma.WhiteBoardHistory.findMany({
      where: { whiteBoardId: id },
      orderBy: { version: 'desc' }
    });
  }
  async setPermission(whiteBoardId: string, userEmail: string, permission: string, ownerEmail: string) {
    // 检查是否是白板拥有者
    if (ownerEmail !== userEmail) {
      throw new Error('只有白板拥有者可以设置权限');
    }

    // 检查白板是否存在
    const whiteboard = await this.prisma.whiteBoard.findUnique({
      where: { id: whiteBoardId }
    });

    if (!whiteboard) {
      throw new Error('白板不存在');
    }

    // 设置或更新权限
    return this.prisma.whiteBoardPermission.upsert({
      where: {
        whiteBoardId_userEmail: {
          whiteBoardId,
          userEmail
        }
      },
      update: {
        permission
      },
      create: {
        whiteBoardId,
        userEmail,
        permission
      }
    });
  }
}