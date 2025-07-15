const express = require('express');
const multer = require('multer');
const path = require('path');

module.exports = (db) => {
    const router = express.Router();

    // Configuración de multer para guardar imágenes
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/img'); // Carpeta donde se guardan las imágenes
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + path.extname(file.originalname);
            cb(null, uniqueSuffix); // Ej: 1627391283.jpg
        }
    });

    const upload = multer({ storage: storage });

    // Obtener todos los emprendimientos
    router.get('/', (req, res) => {
        db.query('SELECT * FROM emprendimientos', (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Crear nuevo emprendimiento con imagen
    router.post('/', upload.single('imagen'), (req, res) => {
        const { nombre, categoria, descripcion, contacto } = req.body;

        // Si no se subió imagen, devolver error
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
        }

        const imagen_url = `/img/${req.file.filename}`; // URL pública de la imagen

        db.query(
            'INSERT INTO emprendimientos (nombre, categoria, descripcion, contacto, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [nombre, categoria, descripcion, contacto, imagen_url],
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).json({ id: result.insertId, imagen_url });
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
