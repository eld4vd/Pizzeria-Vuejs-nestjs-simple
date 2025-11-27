import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TamañosService } from './tamaños.service';
import { TamañosController } from './tamaños.controller';
import { Tamaño } from './entities/tamaño.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tamaño])],
  controllers: [TamañosController],
  providers: [TamañosService],
  exports: [TamañosService],
})
export class TamañosModule {}
