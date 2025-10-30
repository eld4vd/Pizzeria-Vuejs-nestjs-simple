import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo ventaId es obligatorio' })
  @IsInt({ message: 'El campo ventaId debe ser un número entero' })
  readonly ventaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo productoId es obligatorio' })
  @IsInt({ message: 'El campo productoId debe ser un número entero' })
  readonly productoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombreProducto es obligatorio' })
  @IsString({ message: 'El campo nombreProducto debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombreProducto no debe ser mayor a 100 caracteres' })
  readonly nombreProducto: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precioUnitario es obligatorio' })
  @IsNumber({}, { message: 'El campo precioUnitario debe ser un número' })
  @IsPositive({ message: 'El campo precioUnitario debe ser un número positivo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad es obligatorio' })
  @IsInt({ message: 'El campo cantidad debe ser un número entero' })
  @IsPositive({ message: 'El campo cantidad debe ser un número positivo' })
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo subtotal es obligatorio' })
  @IsNumber({}, { message: 'El campo subtotal debe ser un número' })
  @IsPositive({ message: 'El campo subtotal debe ser un número positivo' })
  readonly subtotal: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo notas debe ser de tipo cadena' })
  readonly notas?: string;
}
