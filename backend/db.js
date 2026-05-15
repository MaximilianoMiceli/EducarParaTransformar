import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPromise = open({
  filename: path.join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

export async function initDb() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT NOT NULL,
      activo BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS noticias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      resumen TEXT NOT NULL,
      etiqueta TEXT,
      fecha TEXT
    );

    CREATE TABLE IF NOT EXISTS opiniones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      autor TEXT NOT NULL,
      texto TEXT NOT NULL,
      fecha TEXT
    );

    CREATE TABLE IF NOT EXISTS postulaciones_empleo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT NOT NULL,
      puesto TEXT NOT NULL,
      cv_url TEXT NOT NULL,
      mensaje TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_aspirante TEXT NOT NULL,
        apellido_aspirante TEXT NOT NULL,
        nivel TEXT NOT NULL,
        nombre_tutor TEXT NOT NULL,
        apellido_tutor TEXT NOT NULL,
        email_contacto TEXT NOT NULL,
        telefono_contacto TEXT NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

 
  
  const count = await db.get('SELECT COUNT(*) as count FROM usuarios');
  if (count.count === 0) {
    await db.exec(`
      INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
      ('Admin', 'admin@educar.com', 'admin123', 'autoridad', 1),
      ('Carlos Perez', 'docente@educar.com', 'hola', 'docente', 1),
      ('Maria Lopez', 'maria@test.com', 'hola', 'padre', 1),
      ('Juan Lopez', 'juan@test.com', 'hola', 'alumno', 1);
    `);
    
    await db.exec(`
      INSERT INTO noticias (titulo, resumen, etiqueta, fecha) VALUES 
      ('Feria de Ciencias 2026: Un éxito rotundo', 'Nuestros alumnos de secundaria presentaron proyectos innovadores en robótica y sustentabilidad.', 'Secundaria', '05 May 2026'),
      ('Inauguración de la nueva pista de atletismo', 'Seguimos mejorando nuestras instalaciones deportivas para el bienestar de nuestros estudiantes.', 'Deportes', '28 Abr 2026');
    `);

    await db.exec(`
      INSERT INTO opiniones (autor, texto, fecha) VALUES 
      ('María P.', 'Excelente nivel académico y calidez humana. Mis hijos están felices.', 'Hace 2 días'),
      ('Carlos R.', 'Las instalaciones son de primer nivel. Recomiendo mucho el colegio.', 'Hace 1 semana');
    `);
  }
}

export default dbPromise;
