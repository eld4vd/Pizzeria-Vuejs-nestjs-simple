import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  readonly descripcion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo imagenUrl debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo imagenUrl no debe ser mayor a 255 caracteres' })
  readonly imagenUrl?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser de tipo booleano' })
  readonly activo?: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt({ message: 'El campo orden debe ser de tipo numérico' })
  readonly orden?: number;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'El campo requierePersonalizacion debe ser de tipo booleano' })
  readonly requierePersonalizacion?: boolean;
}
