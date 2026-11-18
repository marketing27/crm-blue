import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
    constructor(private prisma: PrismaService) {}

    private hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }

    async generateKeyForTenant(tenantId: number, allowedIps: string[] = []) {
        // El prefijo 'crm_live' tiene exactamente 8 caracteres, encajando perfecto en tu VarChar(8)
        const prefix = 'crm_live'; 
        const rawSecret = crypto.randomBytes(32).toString('hex');
        const apiKey = `${prefix}_${rawSecret}`;

        const hashedKey = this.hashKey(apiKey);

        await this.prisma.client.orm.public.ApiKey.create({
            key_hash: hashedKey,
            prefix: prefix,
            tenant_id: tenantId,
            status: true,
            allowed_ips: allowedIps, // Se guarda el array de IPs o queda vacío []
        });

        return {
            mensaje: 'Llave generada exitosamente. Guárdala en un lugar seguro, no se volverá a mostrar.',
            apiKey: apiKey, 
        };
    }

    async validateKey(apiKey: string) {
        const hashedIncomingKey = this.hashKey(apiKey);

        // En Prisma 8, las propiedades de filtrado van directo en el objeto
        return this.prisma.client.orm.public.ApiKey.first({
            key_hash: hashedIncomingKey,
        });
    }

    async regenerateApiKey(tenantId: number) {
        // 1. Usamos .all() adaptándonos a la nueva API de Prisma 8
        const llavesActivas = await (this.prisma.client.orm.public.ApiKey.all as any)({
            where: { 
                tenant_id: tenantId, 
                status: true 
            }
        });

        // 2. Inactivarlas iterando sobre ellas (en paralelo)
        if (llavesActivas && llavesActivas.length > 0) {
            await Promise.all(
                llavesActivas.map((llave: any) => 
                    (this.prisma.client.orm.public.ApiKey.update as any)({
                        where: { id: llave.id }, 
                        data: { status: false }
                    })
                )
            );
        }

        // 3. Crear la nueva llave cruda y su hash
        const rawApiKey = `crm_live_${crypto.randomBytes(16).toString('hex')}`;
        const prefix = rawApiKey.substring(0, 13);
        const hashedApiKey = crypto.createHash('sha256').update(rawApiKey).digest('hex');

        // 4. Guardar la nueva llave
        await this.prisma.client.orm.public.ApiKey.create({
            tenant_id: tenantId,
            key_hash: hashedApiKey,
            prefix: prefix,
            status: true,
            allowed_ips: []
        });

        // 5. Retornarla al frontend
        return {
            message: 'Atención: Copie esta nueva API Key. No se volverá a mostrar.',
            apiKey: rawApiKey,
        };
    }

}