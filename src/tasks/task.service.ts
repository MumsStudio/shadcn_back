import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Task } from '../../prisma/client'
import { parse } from 'csv-parse'
import { Readable } from 'stream'
import { Multer } from 'multer'

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(task: Partial<Task>): Promise<Task> {
    return this.prisma.task.create({ data: task })
  }

  async findAll(email: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { email } })
  }

  async findOne(id: string): Promise<Task> {
    return this.prisma.task.findUnique({ where: { id } })
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    await this.prisma.task.update({ where: { id }, data: task })
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } })
  }

  async parseCSV(file: Express.Multer.File, email: string): Promise<void> {
    if (!file || !file.buffer) {
      throw new Error('无效的文件数据');
    }

    try {
      const parser = Readable.from(file.buffer.toString())
        .pipe(parse({
          columns: true,
          skip_empty_lines: true,
          trim: true
        }));

      for await (const record of parser) {
        if (!record.title) {
          console.warn('跳过无效记录: ', record);
          continue;
        }
        await this.create({ ...record, email });
      }
    } catch (error) {
      console.error('CSV解析错误:', error);
      throw new Error('CSV文件解析失败: ' + error.message);
    }
  }
}