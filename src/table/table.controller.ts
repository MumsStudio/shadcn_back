import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from '../utils/token.util';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTableDto: CreateTableDto, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.tableService.create(createTableDto, email);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.tableService.findAll(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.tableService.update(id, updateTableDto, email);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }

  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@Param('id') id: string) {
    return this.tableService.getHistory(id);
  }
}