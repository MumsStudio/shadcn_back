import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCloudDocumentDto } from './dto/create-cloud-document.dto';
import { UpdateCloudDocumentDto } from './dto/update-cloud-document.dto';

@Injectable()
export class CloudDocumentService {
  constructor(private prisma: PrismaService) { }

  async create(createCloudDocumentDto: CreateCloudDocumentDto) {
    return this.prisma.cloudDocument.create({
      data: {
        ...createCloudDocumentDto,
        version: 1,
        lastEditedAt: new Date()
      }
    });
  }

  async findAll() {
    return this.prisma.cloudDocument.findMany({
      include: { document: true }
    });
  }

  async findOne(id: string, email: string) {
    const document = await this.prisma.cloudDocument.findUnique({
      where: { documentId: id },
      include: {
        document: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!document) {
      throw new Error('文档不存在');
    }

    // 检查是否是文档拥有者或有权限的用户
    const hasPermission = document.document.ownerEmail === email ||
      document.document.permissions.some(p => p.userEmail === email);

    if (!hasPermission) {
      return { message: '您没有权限查看此文档', errCode: 403 };
    }

    return document;
  }

  async update(id: string, updateCloudDocumentDto: UpdateCloudDocumentDto, userEmail: string) {
    // 获取文档及权限信息
    const documentWithPermissions = await this.prisma.cloudDocument.findUnique({
      where: { documentId: id },
      include: {
        document: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!documentWithPermissions) {
      throw new Error('文档不存在');
    }

    // 检查用户是否有权限编辑文档
    const editablePermissions = ['EDIT', 'ADMIN'];
    const hasPermission = documentWithPermissions.document.ownerEmail === userEmail ||
      documentWithPermissions.document.permissions.some(
        p => p.userEmail === userEmail && editablePermissions.includes(p.permission)
      );

    if (!hasPermission) {
      { return { message: '您没有权限编辑此文档', errCode: 403 } }
    }

    // 保存历史记录
    await this.prisma.cloudDocumentHistory.create({
      data: {
        documentId: id,
        content: documentWithPermissions.content,
        version: documentWithPermissions.version,
        editedBy: userEmail
      }
    });

    // 更新文档
    return this.prisma.cloudDocument.update({
      where: { documentId: id },
      data: {
        ...updateCloudDocumentDto,
        version: documentWithPermissions.version + 1,
        lastEditedBy: userEmail,
        lastEditedAt: new Date()
      }
    });
  }

  async remove(id: string) {
    return this.prisma.cloudDocument.delete({
      where: { id }
    });
  }

  async getHistory(id: string) {
    return this.prisma.cloudDocumentHistory.findMany({
      where: { documentId: id },
      orderBy: { version: 'desc' }
    });
  }
}