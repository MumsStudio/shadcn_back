import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from '../../prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {
    console.log(prisma.document); // 调试检查
  }

  async create(createDocumentDto: any) {
    return this.prisma.document.create({
      data: {
        ...createDocumentDto,
        createdAt: new Date(),
        parentId: createDocumentDto.parentId || null, // 处理可能的 undefined
      },
    });
  }


  async findAll(ownerEmail: string) {
    return this.prisma.document.findMany({
      where: { ownerEmail }
    });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto
    });
  }

  async remove(id: string) {
    return this.prisma.document.delete({
      where: { id }
    });
  }
}