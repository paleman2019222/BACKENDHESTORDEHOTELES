'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var habitacionSchema =  Schema({
    name: String,
    tipo: String,
    estado: Boolean,
    precio: Number
})
module.exports = mongoose.model('habitacion', habitacionSchema);