'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var hotelSchema = Schema({
    name: String,
    direction: String,
    description: String,
    telefono: Number,
    busqueda: Number,
    
    calificaciones: [{
        calificacion: Number,
        user: String,
        hotel: String
     } ],

    habitacion: [{type: Schema.ObjectId, ref: 'habitacion'}],
     eventos: [{type: Schema.ObjectId, ref: 'habitacion'}],
     images: String,

     admin: {type: Schema.ObjectId, ref: 'user'}
})
module.exports = mongoose.model('hotel', hotelSchema);

