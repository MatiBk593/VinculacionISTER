const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // Obtener todas las noticias
    router.get('/', (req, res) => {
        db.query('SELECT * FROM noticias', (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Crear nueva noticia
    router.post('/', (req, res) => {
        const { titulo, contenido, imagen_url } = req.body;
        db.query(
            'INSERT INTO noticias (titulo, contenido, imagen_url, fecha) VALUES (?, ?, ?, NOW())',
            [titulo, contenido, imagen_url],
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).json({ id: result.insertId });
            }
        );
    });

    // Eliminar noticia
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM noticias WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Noticia eliminada' });
        });
    });

    return router;
};
