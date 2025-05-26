import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CloudDocumentService } from './cloud-document.service';
import { CloudDocumentController } from './cloud-document.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CloudDocumentController],
  providers: [CloudDocumentService],
  exports: [CloudDocumentService]
})
export class CloudDocumentModule { }