const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const budgetSchema = new Schema({
  user: { type: String, required: [true, 'El email del usuario es necesario'] },
  concept: { type: String, required: [true, 'El concepto es necesario'] },
  amount: { type: String, required: [true, 'El monto es necesario'] },
  date: { type: String, required: [true, 'La fecha es necesaria'] },
  createdDate: { type: String, required: [true, 'La fecha de creacion del registro es necesaria'] },
  type: { type: String, required: [true, 'Debe seleccionar si es ingreso o egreso'] },
  class: { type: String, required: [true, 'Debe seleccionar su categoria'] },
});
module.exports = mongoose.model('Budget', budgetSchema);