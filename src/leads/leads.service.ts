import { Injectable, NotFoundException } from '@nestjs/common';
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

    async deleteLead(tenantId: number, leadId: number) {
        const orm = (this.prisma.client.orm.public as any);

        // 1. Verificar que el lead exista y pertenezca al tenant autenticado
        const lead = await orm.Lead.first({
            id: leadId,
            tenant_id: tenantId,
        });

        if (!lead) {
            throw new NotFoundException('Lead no encontrado o no pertenece a tu organización.');
        }

        // 2. Eliminar dependencias hijas (si el lead ya tuvo gestiones, ventas o interacciones)
        const gestiones = await orm.Gestion.findMany({
            where: { lead_id: leadId },
        });

        if (gestiones?.length) {
            const gestionIds = gestiones.map((g: any) => g.id);

            const ventas = await orm.Venta.findMany({
                where: { gestion_id: { in: gestionIds } },
            });

            if (ventas?.length) {
                const ventaIds = ventas.map((v: any) => v.id);
                await orm.Pago.deleteAll({ venta_id: { in: ventaIds } });
                await orm.Venta.deleteAll({ id: { in: ventaIds } });
            }

            await orm.Interaccion.deleteAll({ gestion_id: { in: gestionIds } });
            await orm.Gestion.deleteAll({ lead_id: leadId });
        }

        await orm.Interaccion.deleteAll({ lead_id: leadId });
        await orm.Companion.deleteAll({ lead_id: leadId });
        await orm.IndicadoresGestion.deleteAll({ lead_id: leadId });

        // 3. Eliminar el Lead (libera las referencias hacia contacto, marketing, académica y laboral)
        await orm.Lead.delete({ id: leadId });

        // 4. Eliminar los registros 1 a 1 asociados si existen
        if (lead.contacto_id) {
            await orm.Contacto.delete({ id: lead.contacto_id });
        }
        if (lead.marketing_id) {
            await orm.Marketing.delete({ id: lead.marketing_id });
        }
        if (lead.academica_id) {
            await orm.InformacionAcademica.delete({ id: lead.academica_id });
        }
        if (lead.laboral_id) {
            await orm.InformacionLaboral.delete({ id: lead.laboral_id });
        }

        return {
            deleted: true,
            id: leadId,
            mensaje: 'Lead y todos sus registros asociados fueron eliminados correctamente.',
        };
    }

}
