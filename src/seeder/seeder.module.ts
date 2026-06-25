import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from '../utils/bcrpt';
import { SeederService } from './seeder.service';

@Module({
  imports: [PrismaModule],
  providers: [SeederService, BcryptService],
})
export class SeederModule {}
