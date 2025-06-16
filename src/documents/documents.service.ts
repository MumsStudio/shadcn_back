import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from '../../prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {
    // console.log(prisma.document); // 调试检查
  }

  async create(createDocumentDto: any) {
    const document = await this.prisma.document.create({
      data: {
        ...createDocumentDto,
        createdAt: new Date(),
        parentId: createDocumentDto.parentId || null, // 处理可能的 undefined
      },
    });

    if (createDocumentDto.type === 'file') {
      await this.prisma.cloudDocument.create({
        data: {
          name: createDocumentDto.name,
          documentId: document.id,
          content: '',
          version: 1,
          lastEditedAt: new Date(),
          lastEditedBy: createDocumentDto.ownerEmail
        }
      });
    }

    return document;
  }


  async findAll(userEmail: string) {
    return this.prisma.document.findMany({
      where: {
        OR: [
          { ownerEmail: userEmail },
          {
            permissions: {
              some: {
                userEmail,
                permission: { in: ['VIEW', 'EDIT', 'ADMIN'] }
              }
            }
          }
        ]
      },
      include: { permissions: true }
    });
  }

  async findOne(id: string, email: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { permissions: true }
    });

    if (!document) {
      throw new Error('文档不存在');
    }

    // 检查是否是文档拥有者或有权限的用户
    const hasPermission = document.ownerEmail === email ||
      document.permissions.some(p => p.userEmail === email);
    console.log(hasPermission, 'hasPermission111');
    if (!hasPermission) {
      // throw new Error('您没有权限查看此文档');
      return { message: '您没有权限查看此文档', errCode: 403 };
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, userEmail: string) {
    // 检查用户是否有权限编辑文档
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { permissions: true }
    });

    if (!document) {
      throw new Error('文档不存在');
    }

    // 检查是否是文档拥有者或有编辑权限
    const hasPermission = document.ownerEmail === userEmail ||
      document.permissions.some(p => p.userEmail === userEmail && p.permission === 'EDIT');

    if (!hasPermission) {
      throw new Error('您没有权限编辑此文档');
    }

    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction([
      this.prisma.cloudDocumentHistory.deleteMany({
        where: { documentId: id }
      }),
      this.prisma.documentPermission.deleteMany({
        where: { documentId: id }
      }),
      this.prisma.cloudDocument.deleteMany({  // 改为 deleteMany
        where: { documentId: id }           // 注意字段名是否匹配
      }),
      this.prisma.document.delete({
        where: { id }
      })
    ]);
  }

  async getCollaborators(documentId: string) {
    return this.prisma.documentPermission.findMany({
      where: { documentId },
      select: {
        userEmail: true,
        permission: true,
      }
    });
  }

  async setPermission(documentId: string, userEmail: string, permission: string, ownerEmail: string) {
    // 检查文档是否存在
    const document = await this.prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('文档不存在');
    }

    // 递归设置权限
    const setPermissionRecursive = async (docId: string) => {
      const doc = await this.prisma.document.findUnique({
        where: { id: docId },
        select: { parentId: true }
      });

      // 设置当前文档权限
      await this.prisma.documentPermission.upsert({
        where: {
          documentId_userEmail: {
            documentId: docId,
            userEmail
          }
        },
        update: {
          permission
        },
        create: {
          documentId: docId,
          userEmail,
          permission
        }
      });

      // 递归设置父级文档权限
      if (doc?.parentId && doc.parentId !== '-1') {
        await setPermissionRecursive(doc.parentId);
      }
    };

    return setPermissionRecursive(documentId);
  }

  async removePermission(documentId: string, userEmail: string, ownerEmail: string) {
    // 检查文档是否存在
    const document = await this.prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('文档不存在');
    }

    // 检查是否是文档拥有者
    if (document.ownerEmail !== ownerEmail) {
      throw new Error('只有文档拥有者可以移除权限');
    }

    // 递归移除权限
    const removePermissionRecursive = async (docId: string) => {
      const doc = await this.prisma.document.findUnique({
        where: { id: docId },
        select: { parentId: true }
      });

      // 移除当前文档权限
      await this.prisma.documentPermission.delete({
        where: {
          documentId_userEmail: {
            documentId: docId,
            userEmail
          }
        }
      });

      // 递归移除父级文档权限
      if (doc?.parentId && doc.parentId !== '-1') {
        await removePermissionRecursive(doc.parentId);
      }
    };

    return removePermissionRecursive(documentId);
  }
}