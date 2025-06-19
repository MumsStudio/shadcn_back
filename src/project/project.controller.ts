import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Headers, Patch } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from 'src/utils/token.util';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Headers('Authorization') token: string): Promise<Project[]> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.projectService.findAll(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() data: any, @Headers('Authorization') token: string): Promise<Project> {
    const email = TokenUtil.extractEmailFromToken(token);
    const projectData = {
      ...data,
      creator: email,
    };
    return this.projectService.create(projectData);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() data: any): Promise<Project> {
    return this.projectService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string): Promise<Project> {
    return this.projectService.remove(id);
  }
}