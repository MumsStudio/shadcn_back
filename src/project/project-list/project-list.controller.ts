import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectListService } from './project-list.service';
import { ProjectList } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects/:projectTeamId/lists')
export class ProjectListController {
  constructor(private readonly listService: ProjectListService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('projectTeamId') projectTeamId: string): Promise<ProjectList[]> {
    return this.listService.findAll(projectTeamId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('projectTeamId') projectTeamId: string,
    @Param('id') id: string
  ): Promise<ProjectList> {
    return this.listService.findOne(projectTeamId, id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('projectTeamId') projectTeamId: string,
    @Body() data: any
  ): Promise<ProjectList> {
    return this.listService.create(projectTeamId, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('projectTeamId') projectTeamId: string,
    @Param('id') id: string,
    @Body() data: any
  ): Promise<ProjectList> {
    return this.listService.update(projectTeamId, id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('projectTeamId') projectTeamId: string,
    @Param('id') id: string
  ): Promise<ProjectList> {
    return this.listService.remove(projectTeamId, id);
  }
}