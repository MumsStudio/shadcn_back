import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Headers } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { TokenUtil } from 'src/utils/token.util';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))

  async findByEmail(@Headers('Authorization') token: string): Promise<any> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.profileService.findByEmail(email);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Headers('Authorization') token: string,
    @Body() updateData: Partial<any>,
  ): Promise<any> {
    const email = TokenUtil.extractEmailFromToken(token);
    return this.profileService.update(email, updateData);
  }

  @Delete(':username')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('username') username: string): Promise<void> {
    return this.profileService.delete(username);
  }
}