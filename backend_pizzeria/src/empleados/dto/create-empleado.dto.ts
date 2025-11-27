import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  @IsString({ message: 'El campo usuario debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo usuario no debe ser mayor a 20 caracteres' })
  readonly usuario: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo clave es obligatorio' })
  @IsString({ message: 'El campo clave debe ser de tipo cadena' })
  @MaxLength(250, { message: 'El campo clave no debe ser mayor a 250 caracteres' })
  readonly clave: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsEmail({}, { message: 'El campo email debe ser un correo válido' })
  @MaxLength(100, { message: 'El campo email no debe ser mayor a 100 caracteres' })
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo telefono no debe ser mayor a 20 caracteres' })
  readonly telefono?: string;

  @ApiProperty({ default: 'empleado' })
  @IsOptional()
  @IsString({ message: 'El campo rol debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo rol no debe ser mayor a 20 caracteres' })
  readonly rol?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser de tipo booleano' })
  readonly activo?: boolean;
}
