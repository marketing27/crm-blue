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
        const orm = this.prisma.client.orm.public as any;

        const leads = await orm.Lead.where({
            tenant_id: tenantId,
        }).all();

        const leadsCompletos = await Promise.all(
            leads.map(async (lead: any) => {
                const [contactos, marketings, companions] = await Promise.all([
                    lead.contacto_id
                        ? orm.Contacto.where({ id: lead.contacto_id }).all()
                        : Promise.resolve([]),
                    lead.marketing_id
                        ? orm.Marketing.where({ id: lead.marketing_id }).all()
                        : Promise.resolve([]),
                    orm.Companion.where({ lead_id: lead.id }).all(),
                ]);

                return {
                    ...lead,
                    contacto_rel: contactos?.[0] || null,
                    marketing_rel: marketings?.[0] || null,
                    companions: companions || [],
                };
            })
        );

        // Ordenar del lead más reciente al más antiguo
        return leadsCompletos.sort((a, b) => b.id - a.id);
    }

    async deleteLead(tenantId: number, leadId: number) {
        const orm = this.prisma.client.orm.public as any;

        // 1. Verificar que el lead exista y pertenezca al tenant
        const leads = await orm.Lead.where({
            id: leadId,
            tenant_id: tenantId,
        }).all();

        const lead = leads?.[0];

        if (!lead) {
            throw new NotFoundException('Lead no encontrado o no pertenece a tu organización.');
        }

        // 2. Eliminar dependencias hijas (si existen)
        const gestiones = await orm.Gestion.where({ lead_id: leadId }).all();

        if (gestiones?.length) {
            for (const gestion of gestiones) {
                const ventas = await orm.Venta.where({ gestion_id: gestion.id }).all();

                for (const venta of ventas) {
                    await orm.Pago.where({ venta_id: venta.id }).delete();
                }

                await orm.Venta.where({ gestion_id: gestion.id }).delete();
                await orm.Interaccion.where({ gestion_id: gestion.id }).delete();
            }

            await orm.Gestion.where({ lead_id: leadId }).delete();
        }

        await orm.Interaccion.where({ lead_id: leadId }).delete();
        await orm.Companion.where({ lead_id: leadId }).delete();
        await orm.IndicadoresGestion.where({ lead_id: leadId }).delete();

        // 3. Eliminar el Lead principal
        await orm.Lead.where({ id: leadId }).delete();

        // 4. Eliminar los registros 1 a 1 asociados
        if (lead.contacto_id) {
            await orm.Contacto.where({ id: lead.contacto_id }).delete();
        }
        if (lead.marketing_id) {
            await orm.Marketing.where({ id: lead.marketing_id }).delete();
        }
        if (lead.academica_id) {
            await orm.InformacionAcademica.where({ id: lead.academica_id }).delete();
        }
        if (lead.laboral_id) {
            await orm.InformacionLaboral.where({ id: lead.laboral_id }).delete();
        }

        return {
            deleted: true,
            id: leadId,
            mensaje: 'Lead y todos sus registros asociados fueron eliminados correctamente.',
        };
    }

}
