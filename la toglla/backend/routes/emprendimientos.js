const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Obtener todos los emprendimientos
    router.get('/', (req, res) => {
        db.query('SELECT * FROM emprendimientos', (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Crear nuevo emprendimiento
    router.post('/', (req, res) => {
        const { nombre, categoria, descripcion, contacto, imagen_url } = req.body;
        db.query(
            'INSERT INTO emprendimientos (nombre, categoria, descripcion, contacto, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [nombre, categoria, descripcion, contacto, imagen_url],
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).json({ id: result.insertId });
            }
        );
    });

    // Eliminar emprendimiento
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM emprendimientos WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Emprendimiento eliminado' });
        });
    });

    return router;
};
