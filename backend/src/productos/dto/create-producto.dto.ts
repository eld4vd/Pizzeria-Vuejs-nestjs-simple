import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo categoriaId es obligatorio' })
  @IsInt({ message: 'El campo categoriaId debe ser un número entero' })
  readonly categoriaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
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
