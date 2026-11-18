import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsObject, IsArray, ValidateNested } from 'class-validator';

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
  // Campos obligatorios de la tabla Lead
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido_paterno: string;

  @IsString()
  @IsNotEmpty()
  tipo_documento: string;

  @IsString()
  @IsNotEmpty()
  numero_documento: string;

  // Campos opcionales de la tabla Lead
  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  apellido_materno?: string;

  @IsBoolean()
  @IsOptional()
  cliente_potencial?: boolean;

  // Campos para la tabla relacionada: Contacto
  @IsEmail()
  @IsOptional()
  correo_1?: string;

  @IsString()
  @IsOptional()
  celular_1?: string;

  // Campos para la tabla relacionada: Marketing
  @IsString()
  @IsOptional()
  utm_campaign?: string;

  @IsString()
  @IsOptional()
  fuente?: string;

  @IsObject()
  @IsOptional()
  datos_adicionales?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  companions?: CompanionDto[];

}

