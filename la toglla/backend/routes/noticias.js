const express = require('express');
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

module.exports = (db) => {
    const router = express.Router();

    // Obtener todas las noticias
    router.get('/', (req, res) => {
        db.query('SELECT * FROM noticias', (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Crear nueva noticia con imagen
    router.post('/', upload.single('imagen'), (req, res) => {
        const { titulo, contenido } = req.body;
        const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

        db.query(
            'INSERT INTO noticias (titulo, contenido, imagen_url, fecha) VALUES (?, ?, ?, NOW())',
            [titulo, contenido, imagenPath],
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
