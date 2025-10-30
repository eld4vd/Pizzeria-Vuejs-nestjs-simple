import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmpleadosService } from 'src/empleados/empleados.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Injectable()
export class AuthService {
  constructor(
    private empleadosService: EmpleadosService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto;
    const empleado = await this.empleadosService.validate(email, password);

    const payload = { sub: empleado.id };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN,
      expiresIn: '1d',
    });

    return { ...empleado, access_token };
  }

  async verifyPayload(payload: JwtPayload): Promise<Empleado> {
    let empleado: Empleado;

    try {
      empleado = await this.empleadosService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Empleado inválido: ${payload.sub}`);
    }

    return empleado;
  }
}
