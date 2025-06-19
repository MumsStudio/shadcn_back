import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMember } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(private readonly memberService: ProjectMemberService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Param('projectId') projectId: string): Promise<ProjectMember[]> {
    return this.memberService.findAll(projectId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string
  ): Promise<ProjectMember> {
    return this.memberService.findOne(projectId, id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('projectId') projectId: string,
    @Body() data: any
  ): Promise<ProjectMember> {
    return this.memberService.create(projectId, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() data: any
  ): Promise<ProjectMember> {
    return this.memberService.update(projectId, id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string
  ): Promise<ProjectMember> {
    return this.memberService.remove(projectId, id);
  }
}