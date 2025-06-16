import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { CloudDocumentService } from './cloud-document.service';
import { CreateCloudDocumentDto } from './dto/create-cloud-document.dto';
import { UpdateCloudDocumentDto } from './dto/update-cloud-document.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from 'src/utils/token.util';

@Controller('cloud-document')
export class CloudDocumentController {
  constructor(private readonly cloudDocumentService: CloudDocumentService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCloudDocumentDto: CreateCloudDocumentDto) {
    return this.cloudDocumentService.create(createCloudDocumentDto);
  }

  // @Get()
  // findAll() {
  //   return this.cloudDocumentService.findAll();
  // }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.cloudDocumentService.findOne(id, email);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateCloudDocumentDto: UpdateCloudDocumentDto, @Headers('Authorization') token: string) {
    const userEmail = TokenUtil.extractEmailFromToken(token);
    return this.cloudDocumentService.update(id, updateCloudDocumentDto, userEmail);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.cloudDocumentService.remove(id);
  }

  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@Param('id') id: string) {
    return this.cloudDocumentService.getHistory(id);
  }
}