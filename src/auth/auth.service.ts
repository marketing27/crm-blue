import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(correo: string, pass: string) {
    // Buscamos al usuario (usamos findFirst con as any por la versión RC)
    const user = await (this.prisma.client.orm.public.User.first as any)({
      where: { correo, status: true }
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // Comparamos el hash de la BD con el password ingresado
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // Armamos el payload del token JWT
    const payload = { 
      sub: user.id, 
      email: user.correo, 
      tenantId: user.tenant_id, 
      roleId: user.role_id 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombres: user.nombres,
        rol: user.role_id
      }
    };
  }
}