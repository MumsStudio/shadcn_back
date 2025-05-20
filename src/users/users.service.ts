import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Person } from '../../prisma/client';
import { Prisma } from '../../prisma/client'; // 根据你的路径调整

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserWithPerson(email: string): Promise<{ user: User & { person: Person | null } } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { person: true }
    });

    if (!user) {
      return null;
    }

    return { user };
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { person: true }
    });
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.findOne(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        email,
        password,
        firstName: '',
        lastName: '',
        username: '',
        fullName: '',
        phoneNumber: '',
        role: 'cashier'
      }
    });
  }

  async createUserWithDetails(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findOne(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 由于 User 是类型，不能使用 new 关键字创建实例，这里使用对象字面量创建新的用户对象
    const user = {};
    Object.assign(user, userData);

    return this.prisma.user.create({ data: user });
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ConflictException('User not found');
    }

    if (!updateData.password) {
      updateData.password = user.password;
    }

    await this.prisma.user.update({
      where: { id },
      data: updateData
    });

    return this.prisma.user.findUnique({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateOrCreatePersonByEmail(email: string, personData: Partial<Person>): Promise<any> {
    console.log('User found:', email);
    const user = await this.findOne(email);
    console.log('User found:', user.id);
    // Verifica se o usuário foi encontrad
    if (!user) {
      throw new ConflictException('User not found');
    }

    let person = await this.prisma.person.findFirst({ where: { userId: user.id } });
    console.log('Person found:', person);
    if (!person) {
      // 由于 Person 仅为类型，不能使用 new 关键字创建实例，这里使用对象字面量创建新的 Person 对象
      person = {
        userId: user.id,
        // 可根据实际情况添加 Person 类型所需的其他默认属性
      };
      // person.user.id = user.id;
    }

    const personConfig = Object.assign(person, personData);
    console.log('Updating person:', personConfig);
    await this.prisma.person.upsert({
      where: { userId: user.id },
      update: personConfig,
      create: personConfig
    });
    return { code: 200, message: 'Person updated successfully' };
  }
}