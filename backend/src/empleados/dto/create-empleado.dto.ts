import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
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

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  @IsString({ message: 'El campo password debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo password no debe ser mayor a 255 caracteres' })
  readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo telefono no debe ser mayor a 20 caracteres' })
  readonly telefono?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser de tipo booleano' })
  readonly activo?: boolean;
}
