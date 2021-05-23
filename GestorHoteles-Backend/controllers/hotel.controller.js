'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var User = require('../models/user.model');
var Habitacion = require('../models/habitacion.model');
var Evento = require('../models/eventos.model');
var Reservacion = require('../models/reservacion.model');
var Calificacion = require('../models/calificacion.model');
var Reservacion = require('../models/reservacion.model');



var fs = require('fs');
var path = require('path');


function saveHotelAdmin (req, res){
    var hotel = new Hotel();
    var params = req.body;
    let userId = req.params.id;  
    let adminId = req.params.idA;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        if(params.name && params.direction && params.description && params.telefono){
           
            Hotel.findOne({name: params.name}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(hotelFind){
                    res.status(200).send({message: 'Nombre de hotel en uso'})
                }else{                       
                    User.findOne({_id: adminId}, (err, adminFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(adminFind){
                            if(adminFind.role!='ADMINH'){
                                res.status(200).send({message: 'Este usuario no tiene permiso para administrar el hotel. Cambie el rol en los datos del usuario'})
                            }else{
                                hotel.name = params.name;
                       hotel.direction = params.direction;
                       hotel.description = params.description;
                       hotel.telefono = params.telefono; 
                       hotel.admin =  adminId;          
                       hotel.busqueda = 0;                              
                       hotel.save((err, hotelSaved)=>{
                           if(err){
                                res.status(500).send({message: 'Error general', err})
                            }else if(hotelSaved){    
                                User.findById(adminId, (err, adminFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general', err})
                                    }else if(adminFind){
                                        res.status(200).send({message: 'Hotel registrado con éxito', hotelSaved, adminFind}) 
                                      
                                    }else{
                                        res.status(401).send({message: 'No se pudo registrar el hotel'})
                                    }

                                })
                                                                    
                            }else{
                                res.status(401).send({message: 'No se pudo registrar el hotel'})
                                }
                               })                      
                            }
                        }else{
                            res.status(500).send({message:'Usuario no encontrado'})
                        }
                    })  
                }
            })   
}else{
    res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
}
    }
}

function deleteHotel(req, res){
    var idHotel = req.params.idH;
    var adminId = req.params.id;
    if(adminId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        Hotel.findById(idHotel, (err, hotelfind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(hotelfind){
                if(hotelfind.admin == adminId){
                    Hotel.findByIdAndRemove(idHotel, (err, hotelDeleted)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL'});
                        }else if(hotelDeleted){
                            res.send({message: 'El hotel fue eliminado: '});
                        }else{
                            res.send({message: 'Hotel no eliminado'});
                        }
                    });
                }else{
                    res.status(403).send({message: 'Administrador no autorizado'});
                }             
            }else{
                res.status(403).send({message: 'Administrador no autorizado'});
            }
        })
       
    }
}

function updateHotel(req, res){
    let hotel = req.params.idH;
    let update = req.body;
    let adminId = req.params.id;
    if(adminId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        User.findById(adminId, (err, adminFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(adminFind){
                Hotel.findById(hotel, (err, hotelFind)=>{
                    if(err){
                        res.status(500).send({message: 'ERROR GENRAL', err});
                    }else if(hotelFind){
                        if(hotelFind.admin == adminId){
                            Hotel.findByIdAndUpdate(hotel, update, {new: true}, (err, hotelUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'ERROR GENRAL', err});
                                }else if(hotelUpdated){
                                    res.send({message:'El hotel fue actualizado..', hotelUpdated, adminFind});
                                }else{
                                    res.status(404).send({message: 'Hotel no actualizado'});
                                }
                            });
                        }else{
                            res.status(403).send({message: 'Administrador no autorizado..'});
                        }
                    }else{
                        res.status(404).send({message: 'Hotel no actualizado'});
                    }
                })
               
            }else{
                res.status(403).send({message: 'Administrador no autorizado'});
            }
        })
           
    }

    }

function searchHotel(req, res){
    var params = req.body;
    var hotel = new Hotel();
    if(params.search){
        Hotel.find({$or:[{name: params.search},{direction: params.search},]}, (err, resultsSearch)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err})
            }else if(resultsSearch){  
                Hotel.findById(resultsSearch, (err, hotelFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general', err}) 
                    }else if(hotelFind){

                        hotel.busqueda =+1;
                        hotel.update((err, busquedaSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general', err}) 
                            }else if(busquedaSaved){
                                res.status(200).send({message: 'Resultado', busquedaSaved}) 
                            }else{
                                res.status(403).send({message: 'Busqueda no sumada'}) 
                            }
                        })
                    }else{
                        res.status(403).send({message: 'Hotel no encontrado'}) 
                    }
                })
              
            }else{
                return res.status(404).send({message:'No hay registros para mostrar'})
            }
        })
    }else{
        return res.status(403).send({message:'Ingresa algún dato en el campo de búsqueda'})
    }
}

function getHoteles(req, res){
    Hotel.find({}).populate('calificaciones').exec((err, hotel)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else if(hotel){
            res.status(200).send({message: 'Hoteles encontrados', hotel})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    }) 
}

function saveHabitacion(req, res){
    var habitacion = new Habitacion();
    var params = req.body;
    var userId = req.params.id;
    var hotelId = req.params.idHotel;
        if(userId != req.user.sub){
            res.status(403).send({message: 'No puede acceder a esta funcion'})
        }else{
            Hotel.findById(hotelId, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(hotelFind){
                    if(hotelFind.admin == userId){
                        if(params.name && params.tipo && params.precio){
                            habitacion.name = params.name;
                            habitacion.tipo = params.tipo;
                            habitacion.estado = true;
                            habitacion.precio = params.precio;
                    
                            habitacion.save((err, habitacionSave)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general', err})
                                }else if(habitacionSave){
                                    Hotel.findOneAndUpdate(hotelId, {$push:{habitacion: habitacionSave._id}}, {new: true}, (err, pushHabitacion)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general', err});
                                        }else if(pushHabitacion){
                                            res.send({message: 'Habitacion agregada con exito', habitacionSave})
                                        }else{
                                            res.status(200).send({message: 'no seteado pero en la base de datos'});
                                        }
                                    })
                                }else{
                                    res.status(401).send({message: 'No se pudo agregar la habitacion, intentelo de nuevo mas tarde'})
                                }
                            })
                        }
                    }else{
                        res.status(401).send({message: 'Administrador no autorizado'})
        
                    }
                }else{
                    res.status(401).send({message: 'Hotel no encontrado'})
                }
        
            })     
        }

}

function deleteHabitacion (req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    let habitacionId = req.params.idHab;
if(userId != req.user.sub){
    res.status(500).send({message: 'No puedes acceder a esta funcion'})
}else{
    Hotel.findById(hotelId, (err, hotelFinded)=>{
        if(err){
           res.status(500).send({message: 'error general', err})
        }else if(hotelFinded){
           if(hotelFinded.admin == userId){
       Hotel.findOneAndUpdate({_id: hotelId, habitacion: habitacionId},
           {$pull: {habitacion: habitacionId}}, {new:true}, (err, habitacionPull)=>{
               if(err){
                   return res.status(500).send({message: 'Error general'})
               }else if(habitacionPull){
                   Habitacion.findByIdAndRemove(habitacionId, (err, habitacionRemoved)=>{
                       if(err){
                           return res.status(500).send({message: 'Error general', err})
                       }else if(habitacionRemoved){
                           return res.send({message: 'Habitacion eliminada permanentemente', habitacionPull});
                       }else{
                           return res.status(404).send({message: 'Registro no encontrado o habitacion ya eliminada'})
                       }
                   })
               }else{
                   return res.status(404).send({message: 'No eliminado del hotel, pero si de la base de datos'})
               }
           }).populate('habitacion')
   
           }else{
               res.status(418).send({message: 'Administrador no permitido para agregar habitación'});   
           }
        }else{
   
        }
    })
}


}

function getHabitaciones(req, res){
    let hotelId = req.params.idH;

    Hotel.findById(hotelId, (err, hotelHab)=>{
        if(err){
            res.status(500).send({message: 'Error general al mostrar las habitaciones'});
        }else if(hotelHab){
            res.status(200).send({message: 'Habitaciones: ', habitaciones: hotelHab.habitacion});
        }else{
            res.status(418).send({message: 'No hay registros por mostrar', err});
        }
    })
}


function saveEvento (req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    var params = req.body;
    var evento = new Evento();
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        Hotel.findById(hotelId, (err, hotelFinded)=>{
            if(err){
                res.status(500).send({message: 'error general', err})
             }else if(hotelFinded){
                if(hotelFinded.admin == userId){
                    if(params.name && params.precio && params.fecha && params.hora){
                        Hotel.findById(hotelId, (err, hotelFind)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general', err})
                                }else if(hotelFind){
                                        evento.name = params.name;
                                        evento.estado = true;
                                        evento.precio = params.precio;
                                        evento.fecha = params.fecha;
                                        evento.hora = params.hora;
                                        evento.save((err, eventoSaved)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general', err})
                                    }else if(eventoSaved){
                                        Hotel.findOneAndUpdate(hotelId, {$push:{eventos: eventoSaved._id}}, {new: true}, (err, pushEvento)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general', err});
                                            }else if(pushEvento){
                                                res.send({message: 'Evento agregado con exito', eventoSaved})
                                            }else{
                                                res.status(200).send({message: 'no seteado pero en la base de datos'});
                                            }
                                        })
                                     }else{
                                        res.status(401).send({message: 'No se pudo registrar el evento'})
                                    }
                                     })
                                    }else{
                                        res.status(500).send({message: 'Hotel no encontrado'})
                                       }
                            })
                }else{
                    res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
                }
                }else{
                    res.status(401).send({message: 'Administrador no autorizado'})
                }
            }else{

            }
        })
          
    }
}

function removeEvento(req, res){
    let userId = req.params.id;
    let eventoId = req.params.idE;
    let hotelId = req.params.idH;

    if(userId != req.user.sub){
        return res.status(500).send({message:'No tienes permiso para eliminar un evento'})
    }else{
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                res.status(500).send({message: 'Error general.', err})
            }else if(hotelFind){
                if(hotelFind.admin == userId){
                    Hotel.findOneAndUpdate({_id: hotelId, eventos: eventoId},
                        {$pull: {eventos: eventoId}}, {new:true}, (err, eventoPull)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general..', err})
                            }else if(eventoPull){
                                Evento.findByIdAndRemove(eventoId, (err, eventoRemoved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al eliminar el evento, pero sí eliminado del registro de usuario', err})
                                    }else if(eventoRemoved){
                                        return res.send({message: 'Evento eliminado con exito', eventoPull})
                                    }else{
                                        return res.status(404).send({message: 'Evento no encontrado o ya eliminado'})
                                    }
                                })
                            }else{
                                return res.status(404).send({message: 'No existe el usuario que pueda eliminar el evento'})
                            }
                        }).populate('eventos')
                }else{
            return res.status(403).send({message: 'Administrador no autorizado'})
                }   
            }else{
                return res.status(404).send({message: 'hotel no encontrado'})
            }

        })
    }
}


function saveCalificacion(req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    var params = req.body;
    var calificacion = new Calificacion();
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
    if(hotelId && userId && params.calificacion){
                Hotel.findById(hotelId, (err, hotelFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general', err})
                    }else if(hotelFind){
                                    calificacion.user = userId;
                                    calificacion.hotel = hotelId;
                                    calificacion.calificacion = params.calificacion;
                                    calificacion.save((err, calfSaved)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general', err})
                                        }else if(calfSaved){
                                            Hotel.findByIdAndUpdate(hotelId, {$push:{calificaciones: calificacion}}).populate('calificaciones').exec( {new: true}, (err, pushCalf)=>{
                                                if(err){
                                                    res.status(500).send({message: 'Error general al setear la calificación'});
                                                }else if(pushCalf){
                                                    return res.status(200).send({message: 'Calificación guardada correctamente', calfSaved});
                                                }else{
                                                    res.status(200).send({message: 'no seteado pero en la base de datos'});
                                                }
                                            })
                                        }else{
                                            res.status(401).send({message: 'No se pudo registrar la calificación'})
                                        }

                                    })
                    }else{
                     res.status(500).send({message: 'Hotel no encontrado'})   
                    }
                })
    }else{
        res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
    }
}
}

function getCalificacion(req, res){
    let hotelId = req.params.idH;
        Hotel.findById(hotelId, {$avg:{calificaciones:calificacion}}, (err, calf)=>{
            if(err){
                res.status(500).send({message:'Error general'})
            }else if(calf){
                res.status(200).send({message:'La valoración es de:', calf})
            }else{
                res.status(500).send({message:'No procesado'})
            }
        })
}

function reserveRoom(req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    let habId = req.params.idHab;
    let params = req.body;
    let reservacion = new Reservacion();

    if(userId != req.user.sub){
        res.status(403).send({message: 'Función no permitida para su usuario'})
    }else{
        if(params.fechaReservacion && params.estadia && userId && hotelId && habId){
            Hotel.findById(hotelId,(err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(hotelFind){
                   reservacion.fechaReservacion = params.fechaReservacion;
                   reservacion.estadia = params.estadia;
                   reservacion.user = userId;
                   reservacion.hotel = hotelId;
                   reservacion.habitacion = habId;
                   reservacion.save((err, reservacionSaved)=>{
                       if(err){
                        res.status(500).send({message: 'Error general', err})
                       }else if(reservacionSaved){
                           
                        res.status(200).send({message: 'Reservacion realizada con éxito'})
                       }else{
                        res.status(403).send({message: 'reservacion no completada'})
                       }
                   })   
                }else{
                    res.status(404).send({message: 'Hotel no encontrado'})
                }   
            })
        }else{
            res.status(404).send({message: 'Debe ingresar los datos mínimos de reservacion'})
        } 
    }  
}

function getReservaciones(req, res){
    Reservacion.find({}).populate('habitacion').exec((err, find)=>{
        if(err){
        res.status(500).send({message: 'error general'})
        }else if(find){
            res.status(200).send({message: 'Encontrados', find})
        }else{
            res.status(200).send({message: 'No'})
        }
    })
}
module.exports = {
    saveHotelAdmin,
    deleteHotel,
    updateHotel,
    searchHotel,
    getHoteles,
    saveHabitacion,
    deleteHabitacion,
    getHabitaciones,
    saveEvento,
    removeEvento,
    saveCalificacion,
    getCalificacion,
    reserveRoom,
    getReservaciones
    //saveHotelAdminHotel
}