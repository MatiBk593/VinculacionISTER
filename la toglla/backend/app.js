const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 4001;
const SECRET_KEY = process.env.JWT_SECRET || 'latoglla_secret';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'public/img')));


// Conexión MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307,
    database: process.env.DB_NAME || 'la_toglla'
});
db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    } else {
        console.log('✅ Conectado a la base de datos MySQL');
    }
});

// Rutas
const authRoutes = require('./routes/auth')(db, SECRET_KEY);
const emprendimientosRoutes = require('./routes/emprendimientos')(db);
const noticiasRoutes = require('./routes/noticias')(db);
app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientosRoutes);
app.use('/api/noticias', noticiasRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
