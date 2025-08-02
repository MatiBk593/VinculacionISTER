const express = require('express');
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // nombre único
    }
});
const upload = multer({ storage });

module.exports = (db) => {
    const router = express.Router();

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
        const imagenPath = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null;


        db.query(
            'INSERT INTO emprendimientos (nombre, categoria, descripcion, contacto, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [nombre, categoria, descripcion, contacto, imagenPath],
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
