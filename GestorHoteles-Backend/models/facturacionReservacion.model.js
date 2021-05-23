'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reservacionSchema = Schema({
   remitente: String,
   fecha: Date,
   fechaReservacion: String,
   descripcion: String,
   reservacion: {type: Schema.ObjectId, ref: 'reservacion'},
   user: {type: Schema.ObjectId, ref: 'user'},
   total: Number
})
module.exports = mongoose.model('facturacion', reservacionSchema);

