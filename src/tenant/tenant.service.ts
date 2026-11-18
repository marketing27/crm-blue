import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; // Tu servicio de Prisma
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(data: any) {
    // 1. Hashear el password del administrador
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);

    // 2. Generar la API Key cruda y su hash
    // Genera algo como: crm_live_a1b2c3d4e5f6...
    const rawApiKey = `crm_live_${crypto.randomBytes(16).toString('hex')}`; 
    const prefix = rawApiKey.substring(0, 8); // Guardamos el prefijo visual "crm_live_a1b..."
    const hashedApiKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

    // 3. Transacción atómica Prisma 8
    const newTenant = await this.prisma.client.orm.public.Tenant.create({
      nombre: data.tenantNombre,
      // Opcional: otros campos del tenant
      
      // Creamos el Admin anidado
      usuarios: (m) => m.create({
        nombres: data.adminNombres,
        apellidos: data.adminApellidos,
        correo: data.adminCorreo,
        password: hashedPassword,
        role_id: 3, // Asumiendo que 1 es el ID del rol Administrador
      }),

      // Creamos la API Key anidada
      apiKeys: (m) => m.create({
        key_hash: hashedApiKey,
        prefix: prefix,
        allowed_ips: [], // Array vacío por defecto
      })
    });

    // 4. Retornamos la llave original SOLO ESTA VEZ. 
    // Como en Stripe, si el usuario la pierde, tendrá que revocarla y crear otra.
    return {
      message: 'Agencia creada exitosamente',
      tenantId: newTenant.id,
      adminEmail: data.adminCorreo,
      apiKey: rawApiKey, // ¡Importante! El frontend debe mostrar esto en pantalla para que lo copien
    };
  }

  async findAllTenants() {
    const allTenants = await this.prisma.client.orm.public.Tenant.all();
    return allTenants;
  }

}