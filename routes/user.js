const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
// Get users
app.get('/', (req, res) => {
    User.find({}, 'email')
    .exec((err, users) => {
        if ( err ) {
            return res.status(500).json({
            ok: false,
            message: 'No se pudo enviar'
            })
          }

          res.status(200).json({
            ok: true,
            message: 'Hola =) estas en User',
            users: users
          })
    })
});
// Create user
app.post('/create', (req, res) => {
    const body = req.body;

    if (!body.user || !body.email || !body.pass || body.pass === null) {
        return res.status(400).json({
        ok: false,
        message: 'Debe llenar todo el formulario para registrarse'
      })
      }

      const user = new User({
        user: body.user,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),
    })

      user.save( (err, saveUser) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              message: 'Hubo un error al registrarte',
              err: err
            })
          }
          return res.status(201).json({
            ok: true,
            user: saveUser
          })
      })

})
module.exports = app;