import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

    async createLead(tenantId: number, data: CreateLeadDto) {
        return this.prisma.client.orm.public.Lead.create({
            tenant_id: tenantId,
            primer_nombre: data.primer_nombre,
            segundo_nombre: data.segundo_nombre,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            tipo_documento: data.tipo_documento,
            numero_documento: data.numero_documento,
            cliente_potencial: data.cliente_potencial ?? true,
            
            // 1. Integración del campo JSONB para el Lead
            datos_adicionales: data.datos_adicionales ?? {},

            // 2. Inserción múltiple de acompañantes usando el mutator de Prisma 8
            ...(data.companions && data.companions.length > 0 ? {
                companions: (m) => m.create(
                    data.companions!.map(comp => ({
                        nombre: comp.nombre,
                        apellido: comp.apellido,
                        parentesco_relacion: comp.parentesco_relacion,
                        tipo_documento: comp.tipo_documento,
                        numero_documento: comp.numero_documento,
                        celular: comp.celular,
                        correo: comp.correo,
                        // Integración del campo JSONB individual por acompañante
                        datos_adicionales: comp.datos_adicionales ?? {}
                    }))
                )
            } : {}),
            
            // Sintaxis Prisma 8: Función mutator (m) => m.create(...)
            ...(data.correo_1 || data.celular_1 ? {
                contacto_rel: (m) => m.create({
                    correo_1: data.correo_1,
                    celular_1: data.celular_1,
                })
            } : {}),

            ...(data.utm_campaign || data.fuente || data.utm_source ? {
                marketing_rel: (m) => m.create({
                    campaign_origin: data.campaign_origin,
                    fuente: data.fuente,
                    utm_campaign: data.utm_campaign,
                    utm_medium: data.utm_medium,
                    utm_source: data.utm_source,
                    utm_content: data.utm_content,
                    utm_term: data.utm_term,
                    utm_id: data.utm_id,
                    url_referencia: data.url_referencia,
                    fuente_heredada: data.fuente_heredada,
                    utm_campaign_heredada: data.utm_campaign_heredada,
                    utm_id_heredada: data.utm_id_heredada,
                    utm_term_heredada: data.utm_term_heredada,
                    utm_content_heredada: data.utm_content_heredada,
                    utm_source_heredada: data.utm_source_heredada,
                    utm_medium_heredada: data.utm_medium_heredada,
                })
            } : {}),
        });
    }

    async getLeadsByTenant(tenantId: number) {
        // Usamos .find() para búsquedas condicionales de múltiples registros
        return this.prisma.client.orm.public.Lead.where({
            tenant_id: tenantId,
        }).all();
    }
}
