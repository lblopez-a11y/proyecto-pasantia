const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { buscarProductoConIA } = require('./scraper');
const { generarEnlaceDirecto } = require('./enlacesMarca');

const app = express();
const PORT = 3000;

const db = new sqlite3.Database(path.join(__dirname, 'productos.db'));

app.use(express.json());
app.use(express.static('public'));

app.get('/api/buscar', (req, res) => {
    const q = req.query.q || '';
    const sql = `SELECT * FROM productos WHERE id = ? OR producto LIKE ? LIMIT 10`;
    
    db.all(sql, [q, `%${q}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const rowsConEnlace = rows.map(row => ({
            ...row,
            enlaceOficial: generarEnlaceDirecto(row.producto || '')
        }));

        res.json(rowsConEnlace);
    });
});

app.get('/api/scrapear', async (req, res) => {
    const { id, nombre } = req.query;
    
    if (!id) {
        return res.status(400).json({ error: 'Falta el código/ID del producto' });
    }

    try {
        const nombreProductoFinal = nombre || id;
        const resultado = await buscarProductoConIA({ id, nombre: nombreProductoFinal });
        const enlaceOficial = generarEnlaceDirecto(nombreProductoFinal);

        res.json({
            ...resultado,
            enlaceOficial
        });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando la consulta con IA' });
    }
});

app.post('/api/votar', (req, res) => {
    const { id_producto, es_correcto } = req.body;
    const sql = `INSERT INTO votos (id_producto, es_correcto) VALUES (?, ?)`;

    db.run(sql, [id_producto, es_correcto ? 1 : 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: 'ok', mensaje: 'Respuesta guardada' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});