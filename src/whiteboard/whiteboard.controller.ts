import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { WhiteboardService } from './whiteboard.service';
import { CreateWhiteboardDto } from './dto/create-whiteboard.dto';
import { UpdateWhiteboardDto } from './dto/update-whiteboard.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from 'src/utils/token.util';

@Controller('whiteboard')
export class WhiteboardController {
  constructor(private readonly whiteboardService: WhiteboardService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createWhiteboardDto: CreateWhiteboardDto, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.whiteboardService.create(createWhiteboardDto, email);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  
  findAll(@Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.whiteboardService.findAll(email);
  }
  

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.whiteboardService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateWhiteboardDto: UpdateWhiteboardDto, @Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.whiteboardService.update(id, updateWhiteboardDto, email);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.whiteboardService.remove(id);
  }
  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@Param('id') id: string) {
    return this.whiteboardService.getHistory(id);
  }
}