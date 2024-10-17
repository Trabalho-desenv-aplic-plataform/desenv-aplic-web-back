import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contatos } from 'src/common/database/entities/contatos';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contatos]),
    ConfigModule, 
  ],
  providers: [BotService],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
