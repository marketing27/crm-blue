#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6d2fb33f9b6c2e27bd1d0cbde94783caa38846d0d49238f03aca88e52882f1ae/contract';
import endContract from '../../snapshots/6d2fb33f9b6c2e27bd1d0cbde94783caa38846d0d49238f03aca88e52882f1ae/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract';
import startContract from '../../snapshots/a51b4833fdaffe730572670ccc27dd89af7e0726ab3de7f428d21702d687cc15/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropTable({ schema: 'public', table: 'User' }),
      this.createTable({
        schema: 'public',
        table: 'api_keys',
        columns: [
          col('allowed_ips', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('key_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('prefix', 'character varying(8)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 8 } },
          }),
          col('status', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'api_keys_allowed_ips_elem_not_null_517636bb',
            sql`array_position("allowed_ips", NULL) IS NULL`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'comercial',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('producto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('unidad_negocio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'companion',
        columns: [
          col('apellido', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('celular', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('correo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lead_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('numero_documento', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('parentesco_relacion', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tipo_documento', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'contacto',
        columns: [
          col('celular_1', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('celular_2', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('correo_1', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('correo_2', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('departamento', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('direccion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('distrito', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('horario_preferido_contacto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pais', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('provincia', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('zona', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'gestion',
        columns: [
          col('comercial_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('estado', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lead_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nivel_interes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('stage_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'indicadores_gestion',
        columns: [
          col('contador_correos', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('contador_duplicados', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('contador_llamadas', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('contador_llamadas_efectivas', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('contador_total_interacciones', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('contador_whatsapp', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('dias_sin_relacionamiento', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('fecha_creacion', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fecha_primer_contacto', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fecha_promesa_pago', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fecha_transicion_fase', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('fecha_ultimo_contacto', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lead_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('modificado_por', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tiempo_maduracion_dias', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('tiempo_primer_contacto_min', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('tiempo_transicion_fase_dias', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'informacion_academica',
        columns: [
          col('ano_egreso', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('carrera_especialidad', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('grado_estudio_actual', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('institucion_educativa', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('nivel_estudios', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'informacion_laboral',
        columns: [
          col('cargo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lugar_trabajo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('profesion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sector_economico', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'interacciones',
        columns: [
          col('comentarios_texto', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('duracion', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('gestion_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lead_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tipo_interaccion', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'lead',
        columns: [
          col('academica_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('apellido_materno', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('apellido_paterno', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('cliente_potencial', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('contacto_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('edad', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('estado_civil', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fecha_nacimiento', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('genero', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('laboral_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('marketing_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('numero_documento', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('primer_nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('segundo_nombre', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tipo_documento', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'marketing',
        columns: [
          col('campaign_origin', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fuente', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fuente_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url_referencia', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_campaign', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_campaign_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_content', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_content_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_id', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_id_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_medium', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_medium_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_source', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_source_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_term', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('utm_term_heredada', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'pago',
        columns: [
          col('comprobante_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('concepto', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('fecha_pago', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('metodo_pago', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('monto_pagado', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('venta_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'roles',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre_rol', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'stages',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombre_fase', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orden', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'tenant',
        columns: [
          col('configuracion', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('dominio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('limite_leads_mensual', 'int4', {
            notNull: true,
            default: lit(10000),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('nombre', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('permitir_excedentes', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('apellidos', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('correo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nombres', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('supervisor_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ventas',
        columns: [
          col('cantidad_personas_final', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('estado_venta', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('fecha_fin', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('fecha_inicio', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('gestion_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('monto_final', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('saldo_pendiente', 'numeric', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1' },
          }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'indicadores_gestion',
        constraint: 'indicadores_gestion_lead_id_key',
        columns: ['lead_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lead',
        constraint: 'lead_contacto_id_key',
        columns: ['contacto_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lead',
        constraint: 'lead_academica_id_key',
        columns: ['academica_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lead',
        constraint: 'lead_laboral_id_key',
        columns: ['laboral_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lead',
        constraint: 'lead_marketing_id_key',
        columns: ['marketing_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'tenant',
        constraint: 'tenant_dominio_key',
        columns: ['dominio'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_correo_key',
        columns: ['correo'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'api_keys',
        index: 'api_keys_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comercial',
        index: 'comercial_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'companion',
        index: 'companion_lead_id_idx_cb1c5c02',
        columns: ['lead_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gestion',
        index: 'gestion_comercial_id_idx_9be216a6',
        columns: ['comercial_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gestion',
        index: 'gestion_lead_id_idx_cb1c5c02',
        columns: ['lead_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gestion',
        index: 'gestion_stage_id_idx_1ce9a73f',
        columns: ['stage_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gestion',
        index: 'gestion_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'gestion',
        index: 'gestion_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'indicadores_gestion',
        index: 'indicadores_gestion_modificado_por_idx_bc8d0f3b',
        columns: ['modificado_por'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'indicadores_gestion',
        index: 'indicadores_gestion_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'interacciones',
        index: 'interacciones_gestion_id_idx_53394773',
        columns: ['gestion_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'interacciones',
        index: 'interacciones_lead_id_idx_cb1c5c02',
        columns: ['lead_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'interacciones',
        index: 'interacciones_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lead',
        index: 'lead_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'pago',
        index: 'pago_venta_id_idx_93afdd3e',
        columns: ['venta_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'roles',
        index: 'roles_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'stages',
        index: 'stages_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_role_id_idx_d9467c50',
        columns: ['role_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_supervisor_id_idx_3f7e38d5',
        columns: ['supervisor_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ventas',
        index: 'ventas_gestion_id_idx_53394773',
        columns: ['gestion_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ventas',
        index: 'ventas_tenant_id_fecha_inicio_idx_e1607c89',
        columns: ['tenant_id', 'fecha_inicio'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ventas',
        index: 'ventas_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'api_keys',
        foreignKey: {
          name: 'api_keys_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comercial',
        foreignKey: {
          name: 'comercial_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'companion',
        foreignKey: {
          name: 'companion_lead_id_fkey',
          columns: ['lead_id'],
          references: { schema: 'public', table: 'lead', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gestion',
        foreignKey: {
          name: 'gestion_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gestion',
        foreignKey: {
          name: 'gestion_lead_id_fkey',
          columns: ['lead_id'],
          references: { schema: 'public', table: 'lead', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gestion',
        foreignKey: {
          name: 'gestion_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gestion',
        foreignKey: {
          name: 'gestion_stage_id_fkey',
          columns: ['stage_id'],
          references: { schema: 'public', table: 'stages', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'gestion',
        foreignKey: {
          name: 'gestion_comercial_id_fkey',
          columns: ['comercial_id'],
          references: { schema: 'public', table: 'comercial', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'indicadores_gestion',
        foreignKey: {
          name: 'indicadores_gestion_modificado_por_fkey',
          columns: ['modificado_por'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'indicadores_gestion',
        foreignKey: {
          name: 'indicadores_gestion_lead_id_fkey',
          columns: ['lead_id'],
          references: { schema: 'public', table: 'lead', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'indicadores_gestion',
        foreignKey: {
          name: 'indicadores_gestion_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'interacciones',
        foreignKey: {
          name: 'interacciones_lead_id_fkey',
          columns: ['lead_id'],
          references: { schema: 'public', table: 'lead', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'interacciones',
        foreignKey: {
          name: 'interacciones_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'interacciones',
        foreignKey: {
          name: 'interacciones_gestion_id_fkey',
          columns: ['gestion_id'],
          references: { schema: 'public', table: 'gestion', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lead',
        foreignKey: {
          name: 'lead_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lead',
        foreignKey: {
          name: 'lead_contacto_id_fkey',
          columns: ['contacto_id'],
          references: { schema: 'public', table: 'contacto', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lead',
        foreignKey: {
          name: 'lead_academica_id_fkey',
          columns: ['academica_id'],
          references: { schema: 'public', table: 'informacion_academica', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lead',
        foreignKey: {
          name: 'lead_laboral_id_fkey',
          columns: ['laboral_id'],
          references: { schema: 'public', table: 'informacion_laboral', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lead',
        foreignKey: {
          name: 'lead_marketing_id_fkey',
          columns: ['marketing_id'],
          references: { schema: 'public', table: 'marketing', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'pago',
        foreignKey: {
          name: 'pago_venta_id_fkey',
          columns: ['venta_id'],
          references: { schema: 'public', table: 'ventas', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'roles',
        foreignKey: {
          name: 'roles_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'stages',
        foreignKey: {
          name: 'stages_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_role_id_fkey',
          columns: ['role_id'],
          references: { schema: 'public', table: 'roles', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_supervisor_id_fkey',
          columns: ['supervisor_id'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ventas',
        foreignKey: {
          name: 'ventas_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'tenant', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ventas',
        foreignKey: {
          name: 'ventas_gestion_id_fkey',
          columns: ['gestion_id'],
          references: { schema: 'public', table: 'gestion', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
