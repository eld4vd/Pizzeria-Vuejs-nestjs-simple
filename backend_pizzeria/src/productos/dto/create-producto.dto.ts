import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { CategoriaProducto } from '../entities/producto.entity';

export class CreateProductoDto {
  @ApiProperty({ enum: CategoriaProducto, example: CategoriaProducto.PIZZA })
  @IsNotEmpty({ message: 'El campo categoria es obligatorio' })
  @IsEnum(CategoriaProducto, { message: 'Categoria debe ser: pizza, bebida, postre o extra' })
  readonly categoria: CategoriaProducto;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(150, { message: 'El campo nombre no debe ser mayor a 150 caracteres' })
  readonly nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  readonly descripcion?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio es obligatorio' })
  @IsNumber({}, { message: 'El campo precio debe ser un número' })
  @IsPositive({ message: 'El campo precio debe ser un número positivo' })
  readonly precio: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt({ message: 'El campo stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  readonly stock?: number;

  @ApiProperty({ required: false, type: [String], example: ['personal', 'mediana', 'familiar'] })
  @IsOptional()
  @IsArray({ message: 'Los tamaños disponibles deben ser un array' })
  @IsString({ each: true, message: 'Cada tamaño debe ser una cadena de texto' })
  readonly tamañosDisponibles?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo imagenUrl debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo imagenUrl no debe ser mayor a 255 caracteres' })
  readonly imagenUrl?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo disponible debe ser de tipo booleano' })
  readonly disponible?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean({ message: 'El campo destacado debe ser de tipo booleano' })
  readonly destacado?: boolean;
}
