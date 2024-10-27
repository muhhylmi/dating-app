import { PrismaClient } from "@prisma/client";

export type TDatabases = {
    getSqlClient(): PrismaClient;
};

export class Databases implements TDatabases {
  sql: PrismaClient;

  constructor(){
    this.sql = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  getSqlClient(): PrismaClient{
    return this.sql;
  }
}