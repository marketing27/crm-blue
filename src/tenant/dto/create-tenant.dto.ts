import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsEmail, MinLength } from 'class-validator';

export class CreateTenantDto {
  
  // --- DATOS DE LA AGENCIA (TENANT) ---
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la agencia es obligatorio' })
  tenantNombre: string;

  @IsString()
  @IsOptional()
  dominio?: string;

  @IsInt()
  @Min(1, { message: 'El límite mensual debe ser al menos 1' })
  @IsOptional()
  limite_leads_mensual?: number;


  // --- DATOS DEL USUARIO ADMINISTRADOR ---
  @IsString()
  @IsNotEmpty({ message: 'Los nombres del administrador son obligatorios' })
  adminNombres: string;

  @IsString()
  @IsNotEmpty({ message: 'Los apellidos del administrador son obligatorios' })
  adminApellidos: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo del administrador es obligatorio' })
  adminCorreo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres por seguridad' })
  @IsNotEmpty({ message: 'La contraseña del administrador es obligatoria' })
  adminPassword: string;
}