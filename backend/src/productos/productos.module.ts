import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { ProductoIngrediente } from 'src/producto-ingredientes/entities/producto-ingrediente.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, ProductoIngrediente, Ingrediente])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
