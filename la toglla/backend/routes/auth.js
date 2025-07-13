const express = require('express');

module.exports = (db, jwt, SECRET_KEY) => {
    const router = express.Router();

    // Login
    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Buscar usuario en la base de datos
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error('❌ Error en DB:', err);
                return res.status(500).send('Error en el servidor');
            }
            if (results.length === 0) {
                console.warn('⚠️ Usuario no encontrado:', username);
                return res.status(401).send('Usuario no encontrado');
            }

            const user = results[0];

         if (password !== user.password) {
    console.warn('⚠️ Contraseña incorrecta para usuario:', username);
    return res.status(401).send('Contraseña incorrecta');
}

// Si la contraseña coincide, genera el token
const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' }
);
res.json({ token });

        });
    });

    return router;
};
