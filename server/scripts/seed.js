import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function seed() {
  console.log('Connecting to MySQL host to initialize database...');
  // Connect without database first to create it
  const connection = await mysql.createConnection({
    host: DB_HOST || 'localhost',
    port: DB_PORT ? Number(DB_PORT) : 3306,
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.resolve('../database/schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    console.log('Database and schema initialized successfully.');

    // Now select the database
    await connection.changeUser({ database: DB_NAME || 'academic_management' });

    console.log('Reading sample_data.sql...');
    const sampleDataPath = path.resolve('../database/sample_data.sql');
    let sampleDataSql = fs.readFileSync(sampleDataPath, 'utf8');

    // Hash the default passwords before seeding
    console.log('Hashing default passwords in SQL queries...');
    const adminHash = bcrypt.hashSync('admin123', 10);
    const studentHash = bcrypt.hashSync('student123', 10);

    // Replace the plain-text passwords in sample data with bcrypt hashes
    sampleDataSql = sampleDataSql.replace(/'admin123'/g, `'${adminHash}'`);
    sampleDataSql = sampleDataSql.replace(/'student123'/g, `'${studentHash}'`);

    console.log('Executing sample_data.sql...');
    await connection.query(sampleDataSql);
    console.log('Sample data seeded successfully with hashed passwords.');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

seed();
