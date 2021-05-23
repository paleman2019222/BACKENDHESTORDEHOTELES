'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reservacionEventoSchema =  Schema({
    fechaReservacion: String,
    total: Number,
    user: {type: Schema.ObjectId, ref: 'user'},
    hotel: {type: Schema.ObjectId, ref: 'hotel'},
    evento: {type: Schema.ObjectId, ref: 'evento'}
})
module.exports = mongoose.model('reservacionEvento', reservacionEventoSchema);


