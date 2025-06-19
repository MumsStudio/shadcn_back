import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectTeamService } from './project-team.service';
import { ProjectTeam } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects/:projectId/teams')
export class ProjectTeamController {
  constructor(private readonly teamService: ProjectTeamService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('projectId') projectId: string): Promise<ProjectTeam[]> {
    return this.teamService.findAll(projectId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string
  ): Promise<ProjectTeam> {
    return this.teamService.findOne(projectId, id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('projectId') projectId: string,
    @Body() data: any
  ): Promise<ProjectTeam> {
    return this.teamService.create(projectId, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() data: any
  ): Promise<ProjectTeam> {
    return this.teamService.update(projectId, id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string
  ): Promise<ProjectTeam> {
    return this.teamService.remove(projectId, id);
  }
}