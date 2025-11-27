import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductoIngrediente } from 'src/producto-ingredientes/entities/producto-ingrediente.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Producto, ProductoIngrediente, Ingrediente])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
