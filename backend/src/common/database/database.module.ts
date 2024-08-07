
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
})
export class DatabaseModule {}