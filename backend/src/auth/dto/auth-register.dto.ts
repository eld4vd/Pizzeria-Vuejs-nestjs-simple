import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  clave: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del empleado' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Pérez', description: 'Primer apellido' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  primerApellido: string;

  @ApiProperty({ example: 'García', description: 'Segundo apellido', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  segundoApellido?: string;

  @ApiProperty({ example: 'admin@email.com', description: 'Email del empleado', required: false })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ example: '77123456', description: 'Teléfono del empleado', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ example: 'Av. Principal #123', description: 'Dirección del empleado', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  direccion?: string;
}
