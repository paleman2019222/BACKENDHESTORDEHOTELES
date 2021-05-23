'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventosSchema =  Schema({
    name: String,
    estado: Boolean,
    precio: Number,
    fecha: String,
    hora: String
})
module.exports = mongoose.model('evento', eventosSchema);