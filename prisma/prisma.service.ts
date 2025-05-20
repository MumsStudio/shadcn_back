import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

const { PrismaClient: ActualPrismaClient } = require('@prisma/client');

@Injectable()

export class PrismaService extends ActualPrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}