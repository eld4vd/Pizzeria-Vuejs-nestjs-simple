import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoIngredientesService } from './producto-ingredientes.service';
import { ProductoIngredientesController } from './producto-ingredientes.controller';
import { ProductoIngrediente } from './entities/producto-ingrediente.entity';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoIngrediente]),
    forwardRef(() => ProductosModule),
  ],
  controllers: [ProductoIngredientesController],
  providers: [ProductoIngredientesService],
  exports: [ProductoIngredientesService],
})
export class ProductoIngredientesModule {}
