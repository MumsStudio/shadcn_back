import { Controller, Get, Put, Delete, Param, Body, ConflictException, Post, Headers, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
// import { Person } from './account/person.entity';
import { TokenUtil } from 'src/utils/token.util';
import { Prisma } from 'prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Post()
  findOne(@Body() body) {
    return this.usersService.findOne(body.email);
  }

  @Post('create')
  async create(@Body() body) {
    try {
      return await this.usersService.createUserWithDetails(body);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<any>) {
    return this.usersService.updateUser(parseInt(`${id}`), updateData);
  }

  @Post('person')
  async updateOrCreatePersonByEmail(@Headers('Authorization') token: string, @Body() body: { personData: any }) {
    try {
      const email = TokenUtil.extractEmailFromToken(token);
      return await this.usersService.updateOrCreatePersonByEmail(email, body.personData);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Get('person')
  async findUserWithPerson(@Headers('Authorization') token: string) {
    const email = TokenUtil.extractEmailFromToken(token);
    const result = await this.usersService.findUserWithPerson(email);
    if (!result) {
      return null;
    }
    return result;
  }



  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(parseInt(`${id}`));
  }
}