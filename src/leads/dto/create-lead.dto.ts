import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsObject, IsArray, ValidateNested, Matches } from 'class-validator';

export class CompanionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  parentesco_relacion: string;

  @IsString()
  @IsOptional()
  tipo_documento?: string;

  @IsString()
  @IsOptional()
  numero_documento?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsObject()
  @IsOptional()
  datos_adicionales?: Record<string, any>;
}

export class CreateLeadDto {
  // @IsString()
  // @IsNotEmpty()
  // primer_nombre: string;

  // @IsString()
  // @IsNotEmpty()
  // apellido_paterno: string;

  // @IsString()
  // @IsNotEmpty()
  // tipo_documento: string;

  // @IsString()
  // @IsNotEmpty()
  // numero_documento: string;

  // @IsString()
  // @IsOptional()
  // segundo_nombre?: string;

  // @IsString()
  // @IsOptional()
  // apellido_materno?: string;

  // @IsBoolean()
  // @IsOptional()
  // cliente_potencial?: boolean;

  // @IsEmail()
  // @IsOptional()
  // correo_1?: string;

  // @IsString()
  // @IsOptional()
  // celular_1?: string;

  // @IsString()
  // @IsOptional()
  // utm_campaign?: string;

  // @IsString()
  // @IsOptional()
  // fuente?: string;

  // @IsObject()
  // @IsOptional()
  // datos_adicionales?: Record<string, any>;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @IsOptional()
  // companions?: CompanionDto[];

  // ==========================================
  // 1. DATOS PRINCIPALES DEL LEAD
  // ==========================================
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  apellido_paterno?: string;

  @IsString()
  @IsOptional()
  apellido_materno?: string;

  @IsString()
  @IsOptional()
  tipo_documento?: string;

  @IsString()
  @IsOptional()
  numero_documento?: string;

  @IsBoolean()
  @IsOptional()
  cliente_potencial?: boolean;

  // ==========================================
  // 2. DATOS DE CONTACTO (TABLA RELACIONAL)
  // ==========================================
  @IsEmail()
  @IsOptional()
  correo_1?: string;

  @IsString()
  @IsOptional()
  @Matches(/^9\d{8}$/, { message: 'El celular debe tener 9 dígitos y comenzar con 9' })
  celular_1?: string;

  // ==========================================
  // 3. DATOS FLEXIBLES (JSONB)
  // ==========================================
  @IsObject()
  @IsOptional()
  datos_adicionales?: Record<string, any>;

  // ==========================================
  // 4. DATOS DE MARKETING Y UTMS
  // ==========================================
  @IsString()
  @IsOptional()
  campaign_origin?: string;

  @IsString()
  @IsOptional()
  fuente?: string;

  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @IsString()
  @IsOptional()
  utm_medium?: string;

  @IsString()
  @IsOptional()
  utm_source?: string;

  @IsString()
  @IsOptional()
  utm_content?: string;

  @IsString()
  @IsOptional()
  utm_term?: string;

  @IsString()
  @IsOptional()
  utm_id?: string;

  @IsString()
  @IsOptional()
  url_referencia?: string;

  @IsString()
  @IsOptional()
  fuente_heredada?: string;

  @IsString()
  @IsOptional()
  utm_campaign_heredada?: string;

  @IsString()
  @IsOptional()
  utm_id_heredada?: string;

  @IsString()
  @IsOptional()
  utm_term_heredada?: string;

  @IsString()
  @IsOptional()
  utm_content_heredada?: string;

  @IsString()
  @IsOptional()
  utm_source_heredada?: string;

  @IsString()
  @IsOptional()
  utm_medium_heredada?: string;

  // ==========================================
  // 5. ACOMPAÑANTES (TABLA RELACIONAL EN CASCADA)
  // ==========================================
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  companions?: CompanionDto[];

}

