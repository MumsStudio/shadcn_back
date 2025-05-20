import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, BadRequestException, Headers, UseGuards } from '@nestjs/common'
import { TaskService } from './task.service'
// import { Task } from './task.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import { TokenUtil } from 'src/utils/token.util'
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() task: any): Promise<any> {
    return this.taskService.create(task)
  }

  @Post('import')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Headers('Authorization') token: string) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    if (!file.mimetype.includes('csv')) {
      throw new BadRequestException('仅支持CSV文件格式');
    }

    try {
      const email = TokenUtil.extractEmailFromToken(token);
      return await this.taskService.parseCSV(file, email);
    } catch (error) {
      throw new BadRequestException('文件处理失败: ' + error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Headers('Authorization') token: string): Promise<any[]> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.taskService.findAll(email)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() task: Partial<any>): Promise<any> {
    return this.taskService.update(id, task)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id)
  }
}