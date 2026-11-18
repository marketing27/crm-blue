import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsersDto } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: CreateUsersDto, tenantId: number) {
    // 1. Hashear el password del nuevo asesor/empleado
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // 2. Inserción usando Prisma 8
    const newUser = await this.prisma.client.orm.public.User.create({
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      password: hashedPassword,
      role_id: data.role_id,
      tenant_id: tenantId // <--- Forzamos el ID de la agencia extraído del Token
    });

    // 3. Ocultamos el password en la respuesta por seguridad
    const { password, ...result } = newUser;
    return result;
  }

  async getEmployeesByTenant(tenantId: number) {
    // Usamos .all con "as any" para saltar el validador estricto del RC
    return await (this.prisma.client.orm.public.User.all as any)({
      where: { 
        tenant_id: tenantId, 
        status: true 
      },
      select: { 
        id: true, 
        nombres: true, 
        apellidos: true, 
        correo: true, 
        role_id: true,
        createdAt: true
      }
    });
  }
}