import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';

const prisma = new PrismaClient();

async function executeSQLFromFile(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    const db = new sqlite3.Database('prisma/dev.db', (err) => {
      if (err) {
        reject(err);
      }
    });

    const sql = fs.readFileSync(filePath, 'utf-8');

    db.exec(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

    db.close();
  });
}

async function main() {
  const filePath = path.resolve(__dirname, '../data/products.sql');

  try {
    await executeSQLFromFile(filePath);
    console.log('SQL file executed successfully');
  } catch (error) {
    console.error('Error executing SQL file:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
