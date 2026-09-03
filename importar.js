const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Abrir/Crear la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, 'productos.db'));

console.log('Creando base de datos y leyendo el archivo Excel...');

// 2. Leer el archivo Excel
const workbook = xlsx.readFile('stock_id_producto.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

db.serialize(() => {
    // 3. Crear las tablas si no existen
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY,
        producto TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS votos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_producto INTEGER,
        es_correcto INTEGER,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(id_producto) REFERENCES productos(id)
    )`);

    // 4. Insertar los productos del Excel en la tabla de SQLite
    const stmt = db.prepare(`INSERT OR REPLACE INTO productos (id, producto) VALUES (?, ?)`);
    
    let insertados = 0;
    data.forEach((row) => {
        // Leemos la fila del Excel (columnas "id" y "producto")
        const id = row['id'];
        const producto = row['producto'];

        if (id && producto) {
            stmt.run(id, producto);
            insertados++;
        }
    });

    stmt.finalize();
    console.log(`¡Proceso completado! Se guardaron ${insertados} productos en la base de datos 'productos.db'.`);
});

db.close();