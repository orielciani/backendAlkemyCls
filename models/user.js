const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  user: { type: String, unique: true, required: [true, 'El nombre de user es necesario'] },
  email: { type: String, unique: true, required: [true, 'El email es necesario'] },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
});
userSchema.plugin(uniqueValidator, { message: 'Ya hay una cuenta con ese mismo {PATH}, pruebe con otro' });
module.exports = mongoose.model('User', userSchema);