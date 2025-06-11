import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) { }

  async create(createTableDto: CreateTableDto, email: string) {
    return this.prisma.table.create({
      data: {
        locale: createTableDto.locale || 'zh-CN',
        name: createTableDto.name,
        resources: createTableDto.resources || [],
        sheetOrder: createTableDto.sheetOrder || [],
        sheets: createTableDto.sheets || {},
        styles: createTableDto.styles || {},
        workbookId: createTableDto.workbookId || '',
        ownerEmail: email
      },
    });
  }

  async findAll(ownerEmail: string) {
    return this.prisma.table.findMany(
      { where: { ownerEmail } },
    );
  }

  async findOne(id: string) {
    return this.prisma.table.findUnique({
      where: { id },
      include: {
        history: true,
        permissions: true
      },
    });
  }

  async update(id: string, updateTableDto: UpdateTableDto, email: string) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: { permissions: true }
    });

    if (!table) {
      throw new Error('表格不存在');
    }

    const hasPermission = table.ownerEmail === email ||
      table.permissions.some(p => p.userEmail === email && p.permission === 'EDIT');

    if (!hasPermission) {
      throw new Error('您没有权限编辑此表格');
    }

    await this.prisma.TableHistory.create({
      data: {
        name: table.name,
        resources: table.resources,
        sheetOrder: table.sheetOrder,
        sheets: table.sheets,
        styles: table.styles,
        version: table.version,
        editedBy: email,
        table: {
          connect: { id }
        }
      }
    });

    return this.prisma.table.update({
      where: { id },
      data: {
        name: updateTableDto.name,
        resources: updateTableDto.resources,
        sheetOrder: updateTableDto.sheetOrder,
        sheets: updateTableDto.sheets,
        styles: updateTableDto.styles,
        lastEditedAt: new Date(),
        lastEditedBy: email,
        version: { increment: 1 },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction([
      this.prisma.TableHistory.deleteMany({
        where: { tableId: id }
      }),
      this.prisma.TablePermission.deleteMany({
        where: { tableId: id }
      }),
      this.prisma.table.delete({
        where: { id }
      })
    ]);
  }

  async getHistory(id: string) {
    return this.prisma.TableHistory.findMany({
      where: { tableId: id },
      orderBy: { version: 'desc' }
    });
  }

  async setPermission(tableId: string, userEmail: string, permission: string, ownerEmail: string) {
    if (ownerEmail !== userEmail) {
      throw new Error('只有表格拥有者可以设置权限');
    }

    const table = await this.prisma.table.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      throw new Error('表格不存在');
    }

    return this.prisma.TablePermission.upsert({
      where: {
        tableId_userEmail: {
          tableId,
          userEmail
        }
      },
      update: {
        permission
      },
      create: {
        tableId,
        userEmail,
        permission
      }
    });
  }
}