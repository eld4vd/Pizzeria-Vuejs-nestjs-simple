import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, Not } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta, EstadoVenta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductoIngrediente } from 'src/producto-ingredientes/entities/producto-ingrediente.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(ProductoIngrediente)
    private productoIngredientesRepository: Repository<ProductoIngrediente>,
    @InjectRepository(Ingrediente)
    private ingredientesRepository: Repository<Ingrediente>,
    private dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    // Generar número de venta automático si no se proporciona
    let numeroVenta = createVentaDto.numeroVenta;
    
    if (!numeroVenta || numeroVenta.trim() === '') {
      // Generar número de venta automático: VEN-YYYYMMDD-XXXX
      const fecha = new Date();
      const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
      const count = await this.ventasRepository.count();
      numeroVenta = `VEN-${fechaStr}-${String(count + 1).padStart(4, '0')}`;
    }

    const existe = await this.ventasRepository.findOneBy({
      numeroVenta: numeroVenta.trim(),
    });

    if (existe) throw new ConflictException('La venta ya existe');

    // Validar stock disponible antes de crear la venta
    if (createVentaDto.detalles && createVentaDto.detalles.length > 0) {
      await this.validarStockDisponible(createVentaDto.detalles);
    }

    // Usar transacción para guardar venta, detalles y actualizar stock
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear venta
      const venta = new Venta();
      venta.numeroVenta = numeroVenta.trim();
      if (createVentaDto.idEmpleado) venta.idEmpleado = createVentaDto.idEmpleado;
      if (createVentaDto.idCliente) venta.idCliente = createVentaDto.idCliente;
      venta.tipoVenta = createVentaDto.tipoVenta;
      venta.metodoPago = createVentaDto.metodoPago;
      venta.clienteNombre = createVentaDto.clienteNombre.trim();
      venta.clienteTelefono = createVentaDto.clienteTelefono.trim();
      if (createVentaDto.clienteEmail) venta.clienteEmail = createVentaDto.clienteEmail.trim();
      if (createVentaDto.clienteNotas) venta.clienteNotas = createVentaDto.clienteNotas.trim();
      venta.subtotal = createVentaDto.subtotal;
      venta.descuento = createVentaDto.descuento ?? 0;
      venta.total = createVentaDto.total;
      venta.estado = createVentaDto.estado ?? EstadoVenta.PENDIENTE;
      if (createVentaDto.notasInternas) venta.notasInternas = createVentaDto.notasInternas.trim();
      
      const ventaGuardada = await queryRunner.manager.save(venta);

      // Crear detalles y descontar stock si existen
      if (createVentaDto.detalles && createVentaDto.detalles.length > 0) {
        for (const detalleDto of createVentaDto.detalles) {
          const detalle = new DetalleVenta();
          detalle.idVenta = ventaGuardada.id;
          detalle.idProducto = detalleDto.idProducto;
          detalle.nombreProducto = detalleDto.nombreProducto.trim();
          detalle.precioUnitario = detalleDto.precioUnitario;
          detalle.cantidad = detalleDto.cantidad;
          detalle.subtotal = detalleDto.subtotal;
          if (detalleDto.notas) detalle.notas = detalleDto.notas.trim();
          
          await queryRunner.manager.save(detalle);

          // Descontar stock del producto
          const producto = await queryRunner.manager.findOne(Producto, {
            where: { id: detalleDto.idProducto }
          });

          if (producto) {
            producto.stock = Number(producto.stock) - Number(detalleDto.cantidad);
            await queryRunner.manager.save(producto);
            console.log(`📦 Stock producto "${producto.nombre}": ${Number(producto.stock) + Number(detalleDto.cantidad)} → ${producto.stock}`);
          }

          // Descontar stock de ingredientes del producto vendido
          await this.descontarStockIngredientes(
            detalleDto.idProducto,
            detalleDto.cantidad,
            queryRunner
          );
        }
      }

      await queryRunner.commitTransaction();

      // Retornar venta con detalles
      return this.findOne(ventaGuardada.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Valida que haya stock suficiente de productos e ingredientes para la venta
   */
  private async validarStockDisponible(detalles: any[]): Promise<void> {
    console.log(`🔎 Validando stock para ${detalles.length} productos...`);
    
    for (const detalle of detalles) {
      // 1. Validar stock del producto
      const producto = await this.productosRepository.findOne({
        where: { id: detalle.idProducto }
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${detalle.idProducto} no encontrado`);
      }

      const stockProducto = Number(producto.stock) || 0;
      const cantidadSolicitada = Number(detalle.cantidad) || 0;

      console.log(`  📦 Producto "${producto.nombre}": Stock ${stockProducto}, Solicitado ${cantidadSolicitada}`);

      if (stockProducto < cantidadSolicitada) {
        throw new BadRequestException(
          `Stock insuficiente del producto "${producto.nombre}". ` +
          `Disponible: ${stockProducto}, Solicitado: ${cantidadSolicitada}`
        );
      }

      // 2. Validar stock de ingredientes del producto
      const productoIngredientes = await this.productoIngredientesRepository.find({
        where: { idProducto: detalle.idProducto },
        relations: ['ingrediente'],
      });

      console.log(`  🧪 Ingredientes: ${productoIngredientes.length}`);

      for (const prodIng of productoIngredientes) {
        const cantidadIngrediente = Number(prodIng.cantidad) || 0;
        const cantidadProducto = Number(detalle.cantidad) || 0;
        const cantidadNecesaria = cantidadIngrediente * cantidadProducto;
        const ingrediente = prodIng.ingrediente;
        const stockActual = Number(ingrediente.stock) || 0;

        console.log(`    🔹 ${ingrediente.nombre}: Necesario ${cantidadNecesaria}, Disponible ${stockActual}`);

        if (stockActual < cantidadNecesaria) {
          throw new BadRequestException(
            `Stock insuficiente del ingrediente "${ingrediente.nombre}". ` +
            `Necesario: ${cantidadNecesaria}, Disponible: ${stockActual}`
          );
        }
      }
    }
    
    console.log(`✅ Validación de stock completa`);
  }

  /**
   * Descuenta el stock de ingredientes de un producto vendido
   */
  private async descontarStockIngredientes(
    idProducto: number,
    cantidadProducto: number,
    queryRunner: any
  ): Promise<void> {
    // Obtener ingredientes del producto
    const productoIngredientes = await queryRunner.manager.find(ProductoIngrediente, {
      where: { idProducto },
    });

    console.log(`🔍 Producto ID: ${idProducto}, Cantidad vendida: ${cantidadProducto}`);
    console.log(`📦 Ingredientes encontrados: ${productoIngredientes.length}`);

    // Descontar stock de cada ingrediente
    for (const prodIng of productoIngredientes) {
      const cantidadIngrediente = Number(prodIng.cantidad) || 0;
      const cantidadProd = Number(cantidadProducto) || 0;
      const cantidadADescontar = cantidadIngrediente * cantidadProd;
      
      console.log(`  ➖ Ingrediente ID: ${prodIng.idIngrediente}, Cantidad a descontar: ${cantidadADescontar}`);
      
      await queryRunner.manager.decrement(
        Ingrediente,
        { id: prodIng.idIngrediente },
        'stock',
        cantidadADescontar
      );
    }
    
    console.log(`✅ Stock descontado correctamente`);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({ 
      relations: ['empleado', 'detalles'],
      order: { fechaVenta: 'DESC' } 
    });
  }

  /**
   * Busca pedidos de un cliente por su número de teléfono
   * Solo retorna pedidos activos (no cancelados ni entregados hace más de 24h)
   */
  async findByTelefono(telefono: string): Promise<Venta[]> {
    const ventas = await this.ventasRepository.find({
      where: {
        clienteTelefono: telefono,
        estado: Not(In([EstadoVenta.ENTREGADA, EstadoVenta.CANCELADA])),
      },
      relations: ['detalles'],
      order: { fechaVenta: 'DESC' },
    });

    // También incluir pedidos entregados/cancelados en las últimas 24 horas
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    const ventasRecientes = await this.ventasRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .where('venta.clienteTelefono = :telefono', { telefono })
      .andWhere('venta.estado IN (:...estados)', { 
        estados: [EstadoVenta.ENTREGADA, EstadoVenta.CANCELADA] 
      })
      .andWhere('venta.fechaVenta >= :fecha', { fecha: hace24Horas })
      .orderBy('venta.fechaVenta', 'DESC')
      .getMany();

    return [...ventas, ...ventasRecientes];
  }

  /**
   * Busca todos los pedidos de un cliente autenticado por su ID
   */
  async findByCliente(idCliente: number): Promise<Venta[]> {
    return this.ventasRepository.find({
      where: { idCliente },
      relations: ['detalles'],
      order: { fechaVenta: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: ['empleado', 'detalles'],
    });
    if (!venta) throw new NotFoundException('La venta no existe');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    const ventaUpdate = Object.assign(venta, updateVentaDto);
    return this.ventasRepository.save(ventaUpdate);
  }

  /**
   * Cancela un pedido (solo si está en estado pendiente o confirmada)
   */
  async cancelarPedido(id: number): Promise<Venta> {
    const venta = await this.findOne(id);

    // Solo permitir cancelar si está pendiente o confirmada
    const estadosPermitidos = [EstadoVenta.PENDIENTE, EstadoVenta.CONFIRMADA];
    
    if (!estadosPermitidos.includes(venta.estado)) {
      throw new BadRequestException(
        `No se puede cancelar el pedido. Estado actual: ${venta.estado}. ` +
        `Solo se pueden cancelar pedidos en estado: ${estadosPermitidos.join(', ')}`
      );
    }

    venta.estado = EstadoVenta.CANCELADA;
    
    // Restaurar stock de productos e ingredientes
    await this.restaurarStock(venta);

    return this.ventasRepository.save(venta);
  }

  /**
   * Restaura el stock de productos e ingredientes cuando se cancela una venta
   */
  private async restaurarStock(venta: Venta): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const detalle of venta.detalles) {
        // Restaurar stock del producto
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: detalle.idProducto }
        });

        if (producto) {
          producto.stock = Number(producto.stock) + Number(detalle.cantidad);
          await queryRunner.manager.save(producto);
          console.log(`📦 Stock restaurado producto "${producto.nombre}": ${producto.stock}`);
        }

        // Restaurar stock de ingredientes
        const productoIngredientes = await queryRunner.manager.find(ProductoIngrediente, {
          where: { idProducto: detalle.idProducto },
        });

        for (const prodIng of productoIngredientes) {
          const cantidadARestaurar = Number(prodIng.cantidad) * Number(detalle.cantidad);
          
          await queryRunner.manager.increment(
            Ingrediente,
            { id: prodIng.idIngrediente },
            'stock',
            cantidadARestaurar
          );
          console.log(`🧪 Stock restaurado ingrediente ID ${prodIng.idIngrediente}: +${cantidadARestaurar}`);
        }
      }

      await queryRunner.commitTransaction();
      console.log(`✅ Stock restaurado por cancelación de venta #${venta.numeroVenta}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error al restaurar stock:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    return this.ventasRepository.softRemove(venta);
  }
}
