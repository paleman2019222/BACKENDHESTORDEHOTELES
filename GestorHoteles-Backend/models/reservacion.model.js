'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reservacionSchema =  Schema({
    fechaReservacion: String,
    estadia: Number,
    total: Number,
    user: {type: Schema.ObjectId, ref: 'user'},
    hotel: {type: Schema.ObjectId, ref: 'hotel'},
    habitacion: {type: Schema.ObjectId, ref: 'habitacion'}
})
module.exports = mongoose.model('reservacion', reservacionSchema);