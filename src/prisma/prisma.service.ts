// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Importamos la instancia 'db' exportada desde el archivo db.ts que generó Prisma.
// Nota: En NodeNext, las importaciones relativas requieren la extensión .js (aunque el archivo sea .ts)
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Exponemos el cliente de base de datos completo
  public readonly client = db;

  async onModuleInit() {
    // En Prisma 8, el pool de conexiones se maneja de forma automática (lazy loading)
    // al ejecutar la primera consulta, por lo que no es necesario un connect() manual aquí.
  }

  async onModuleDestroy() {
    // Aquí puedes invocar el cierre del pool si el runtime de Prisma 8 lo requiere en el futuro
  }
}