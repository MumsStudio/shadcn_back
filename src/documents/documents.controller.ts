import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from 'src/utils/token.util';
import { Document } from '../../prisma/client';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createDocumentDto: CreateDocumentDto, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.documentsService.create({ ...createDocumentDto, ownerEmail: email });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.documentsService.findAll(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto,
    @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.documentsService.update(id, updateDocumentDto, email);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Post(':id/permissions')
  @UseGuards(AuthGuard('jwt'))
  setPermission(
    @Param('id') documentId: string,
    @Body('userEmail') userEmail: string,
    @Body('permission') permission: string,
    @Headers('Authorization') token: string
  ) {
    const ownerEmail = TokenUtil.extractEmailFromToken(token);
    return this.documentsService.setPermission(documentId, userEmail, permission, ownerEmail);
  }
}