'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var hotelController = require('../controllers/hotel.controller');
const { ensureAuth } = require('../middlewares/authenticated');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});
//var connect = require('connect-multiparty');

//USUARIOS
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
//api.put('/updateUser/:id' , mdAuth.ensureAuth, userController.updateUser);
api.put('/updateUserAdmin/:idU/:idA' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.updateUserAdmin);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.searchUser);
api.get('/getUsers', userController.getUsers);
api.put('/updateUserU/:idU', mdAuth.ensureAuth, userController.updateUserU);
api.delete('/removeUser/:idU', mdAuth.ensureAuth, userController.removeUser);
//imagenes
api.put('/:id/uploadImage', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:fileName', [ mdUpload], userController.getImage);


//HOTELES
//funcion para que únicamente el administrador de aplicacion agregue un hotel.
api.post('/saveHotelAdmin/:id/:idA' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  hotelController.saveHotelAdmin);
api.delete('/deleteHotel/:id/:idH' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdminH],  hotelController.deleteHotel);
api.put('/updateHotel/:id/:idH' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdminH],  hotelController.updateHotel);
api.post('/searchHotel', hotelController.searchHotel);
api.get('/getHoteles', hotelController.getHoteles);
api.post('/saveCalificacion/:id/:idH', mdAuth.ensureAuth, hotelController.saveCalificacion);
api.get('/getCalificacion/:idH', mdAuth.ensureAuth, hotelController.getCalificacion);


//HABITACION
api.put('/setHabitacion/:id/:idHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminH], hotelController.saveHabitacion);
api.delete('/removeHabitacion/:id/:idH/:idHab', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminH], hotelController.deleteHabitacion);
api.get('/getHabitaciones/:idH', hotelController.getHabitaciones);


//EVENTOS
api.put('/saveEvento/:id/:idH', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminH], hotelController.saveEvento);
api.delete('/removeEvento/:id/:idH/:idE', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminH], hotelController.removeEvento);

//reserveRoom
api.post('/reserveRoom/:id/:idH/:idHab',[mdAuth.ensureAuth, mdAuth.ensureAuthUser], hotelController.reserveRoom);
api.get('/getReservaciones', hotelController.getReservaciones);



module.exports = api;




