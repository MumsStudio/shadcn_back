import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Profile, User } from '../../../prisma/client';


@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
  ) { }



  async findByEmail(email: string): Promise<Profile> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log('user', user);
    if (!user) return null;

    let profile = await this.prisma.profile.findUnique({
      where: { username: user.username },
      include: { user: true }
    });
    if (!profile && user.username) {
      const profileData: any = {
        username: user.username,
        email: '',
        bio: '',
        urls: [],
        user: {
          connect: { id: user.id }
        },
      };
      profile = await this.prisma.profile.create({
        data: profileData,
        include: { user: true }
      });
    }
    return profile;
  }

  async update(email: string, updateData: Partial<any>): Promise<Profile> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    if (!user.username) {
      if (!updateData.username) {
        throw new Error('Username is required in updateData when user has no username');
      }
      return this.prisma.profile.update({
        where: { username: user.username },
        data: updateData
      });
    }

    if (updateData.urls) {
      updateData.urls = Array.isArray(updateData.urls) ? updateData.urls : JSON.parse(updateData.urls);
    }

    if (updateData.username) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { username: updateData.username }
      });
    }

    await this.prisma.profile.update({
      where: { username: user.username },
      data: updateData
    });
    return this.prisma.profile.findUnique({
      where: { username: user.username || updateData.username },
      include: { user: true }
    });
  }

  async delete(username: string): Promise<void> {
    await this.prisma.profile.delete({ where: { username } });
  }
}