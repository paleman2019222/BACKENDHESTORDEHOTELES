'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var calificacionSchema =  Schema({
    calificacion: Number,
    user: {type: Schema.ObjectId, ref: 'user'},
    hotel: {type: Schema.ObjectId, ref: 'hotel'}
})
module.exports = mongoose.model('calificacion', calificacionSchema);