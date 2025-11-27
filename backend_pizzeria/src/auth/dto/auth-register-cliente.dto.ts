import { IsString, IsNotEmpty, MinLength, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterClienteDto {
  @ApiProperty({ example: 'juan_perez', description: 'Nombre de usuario único' })
  @IsString()
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @MaxLength(50)
  usuario: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  clave: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente' })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: '77123456', description: 'Teléfono del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ example: 'Av. Principal #123', description: 'Dirección del cliente', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  direccion?: string;
}
