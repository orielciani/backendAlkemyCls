const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const User = require('../models/user');
const mdAuth = require('../middleware/auth');
const app = express();
// Login
app.post('/',  (req, res) => {
    const body = req.body;
    User.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas, user no existe',
                errors: err
            });
        }
        if ( !body.pass ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas, sin pw'
            });
        }
        if (!bcrypt.compareSync(body.pass, userDB.pass)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas, pw erronea',
                errors: err
            });
        }
        // Create token
        userDB.password = undefined;
        const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas
        return res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    })
// New Token
app.get('/newtoken', [mdAuth.verifyToken],  (req, res) => {
        const token = jwt.sign({ user: req.user }, SEED, { expiresIn: 14400 }); // 4 horas
        res.status(200).json({
            ok: true,
            token: token
        });
    });
});

module.exports = app;