const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/noticias', upload.single('noticia_imagen'), (req, res) => {
  const { titulo, contenido } = req.body;
  const imagenUrl = `/img/${req.file.filename}`;

  // Aquí puedes guardar los datos en la base de datos
  console.log({ titulo, contenido, imagenUrl });

  res.json({ message: 'Noticia agregada correctamente', imagenUrl });
});

module.exports = router;

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
