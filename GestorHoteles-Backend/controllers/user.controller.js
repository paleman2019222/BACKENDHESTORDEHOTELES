'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


var fs = require('fs');
var path = require('path');


function createInit(req,res){
    let user = new User();
    user.password = '12345';
    user.username = 'admin';

    User.findOne({username: user.username}, (err, userFind)=>{
            if(err){
                console.log('Error general');
            }else if(userFind){
                console.log('no se puede agregar un nuevo usuario administrador');
            }else{
                bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                    if(err){
                        console.log('Error al crear el usuario');
                    }else if(passwordHash){
                       
                        user.username = 'admin'
                        user.name='admin'
                        user.role = 'ROLE_ADMIN'    
                        user.password = passwordHash;
                            
                        user.save((err, userSaved)=>{
                            
                            if(err){
                                console.log('Error al crear el usuario');
                            }else if(userSaved){
                                console.log('Usuario administrador creado');
                               
                                
                            }else{
                                console.log('Usuario administrador no creado');
                            }
                        })
                    }else{
                        console.log('No se encriptó la contraseña');
                    } 
                })
            }
    })
}

function createInitAdminH(req,res){
    let user = new User();
    user.password = '12345';
    user.username = 'adminH';

    User.findOne({username: user.username}, (err, userFind)=>{
            if(err){
                console.log('Error general');
            }else if(userFind){
                console.log('no se puede agregar un nuevo usuario administrador de hotel');
            }else{
                bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                    if(err){
                        console.log('Error al crear el usuario');
                    }else if(passwordHash){
                       
                        user.username = 'adminH'
                        user.name='adminH'
                        user.role = 'ADMINH'    
                        user.password = passwordHash;
                            
                        user.save((err, userSaved)=>{
                            
                            if(err){
                                console.log('Error al crear el usuario');
                            }else if(userSaved){
                                console.log('Usuario administrador de hotel creado');
                               
                                
                            }else{
                                console.log('Usuario no creado');
                            }
                        })
                    }else{
                        console.log('No se encriptó la contraseña');
                    } 
                })
            }
    })
}

function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        res.status(500).send({message: 'Error genral'})
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({
                                token: jwt.createToken(userFind),
                                user: userFind
                            })
                        }else{ 
                            res.status(200).send({message: 'Usuario logeado correctamente'})
                    }
                       
                    }else{
                        res.status(200).send({message: 'Contraseña o usuario incorrectos'})
                    }
                })
            }else{
                res.status(404).send({message: 'usuario no encontrado'});
            }
        })
    }else{
        res.status(404).send({message: 'Por favor ingrese los datos necesarios'});
    }

}

function saveUser (req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.password){
            if(params.role){
                res.status(500).send({message: 'No puede ingresar un rol específico.'})
            }else{
                User.findOne({username: params.username}, (err, userFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general', err})
                    }else if(userFind){
                        res.status(200).send({message: 'Nombre de usuario en uso'})
                    }else{
                        bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general en la encriptación de contraseña', err})
                                }else if(passwordHash){
                                        user.password = passwordHash;
                                        user.name = params.name;
                                        user.username = params.username;
                                        user.role = 'USER';

                                        user.save((err, userSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general', err})
                                            }else if(userSaved){
                                                res.status(200).send({message: 'Usuario registrado con éxito'})
                                            }else{
                                                res.status(401).send({message: 'No se pudo registrar el usuario'})
                                            }

                                        })
                                }else{
                                    res.status(500).send({message: 'No se pudo encriptar la contraseña'})
                                }
                        })
                    }

                })
            }
    }else{
        res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'no tienes permiso para realizar esta operacion'})
    }else{
        
        if(update.password){
            return res.status(403).send({message: 'No se puede actualizar la contraseña a traves de esta funcion'});
        }else{
            if(update.role){
                return res.status(403).send({message: 'No se puede actualizar el rol de usuario'});
            }else{
                if(update.username){
                    User.findOne({username: update.username}, (err, usernameFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(usernameFind){
                            return res.status(200).send({message: 'Nombre de usuario en uso'});
                        }else{
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(userUpdated){
                                    return res.status(401).send({message: 'Usuario actualizado'});
                                }else{
                                    return res.status(401).send({message: 'No se actualizó el usuario'});
                                }
                            })
                        }
                    })
                }else{
                    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            return res.status(401).send({message: 'Usuario actualizado'});
                        }else{
                            return res.status(401).send({message: 'No se actualizó el usuario'});
                        }
                    })
                }
            }



          
        }
    }

   
    
}

function removeUserAdmin(req, res){
    let userId = req.params.id;
    let params = req.body;
    if(userId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, passwordCheck)=>{
                        if(err){
                            res.status(500).send({message: 'Error general', err})
                        }else if(passwordCheck){
                                User.findByIdAndRemove(userId, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'})
                                    }else if(userFind){
                                        res.status(200).send({message: 'Eliminado correctamente'})
                                    }else{
                                        res.status(403).send({message: 'No eliminado'})
                                    }
                                })
                        }else{
                            res.status(403).send({message: 'Contraseña incorrecta'})
                        }
                    })
            }else{
                res.status(403).send({message: 'Usuario inexistente'})
            }

        })
        
       
    }
}

function removeUser(req, res){
    let userId = req.params.idU;
    let params = req.body;
    if(userId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                if(params.password){
                    bcrypt.compare(params.password, userFind.password, (err, passwordCheck)=>{
                        if(err){
                            res.status(500).send({message: 'Error general', err})
                        }else if(passwordCheck){
                                User.findByIdAndRemove(userId, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general'})
                                    }else if(userFind){
                                        res.status(200).send({message: 'Eliminado correctamente'})
                                    }else{
                                        res.status(403).send({message: 'NO eliminado'})
                                    }
                                })
                        }else{
                            res.status(403).send({message: 'Contraseña incorrecta'})
                        }
                    })
                }else{
                    res.status(200).send({message:'Ingrese la contraseña del usuario para eliminar'})
                }
            }else{
                res.status(403).send({message: 'Usuario inexistente'})
            }

        })
        
       
    }
}


//UPDATE ÚNICAMENTE PARA ADMIN DE APLICACION
function updateUserAdmin(req, res){
    let userId = req.params.idU;
    let adminId = req.params.idA;
    let update = req.body;

    if(adminId != req.user.sub){
        return res.status(404).send({message: 'no tienes permiso para realizar esta operacion'})
    }else{
        
        if(update.password){
            return res.status(403).send({message: 'No se puede actualizar la contraseña a traves de esta funcion'});
        }else{
            
                if(update.username){
                    User.findOne({username: update.username}, (err, usernameFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(usernameFind){
                            return res.status(200).send({message: 'Nombre de usuario en uso'});
                        }else{
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(userUpdated){
                                    return res.status(401).send({message: 'Usuario actualizado'});
                                }else{
                                    return res.status(401).send({message: 'No se actualizó el usuario'});
                                }
                            })
                        }
                    })
                }else{
                    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            return res.status(401).send({message: 'Usuario actualizado'});
                        }else{
                            return res.status(401).send({message: 'No se actualizó el usuario'});
                        }
                    })
                } 
        }
    }   
}

function updateUserU(req, res){
    let userId = req.params.idU;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'no tienes permiso para realizar esta operacion'})
    }else{
        if(update.password){
            return res.status(403).send({message: 'No se puede actualizar la contraseña a traves de esta funcion'});
        }else{
                if(update.username){
                    User.findOne({username: update.username}, (err, usernameFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(usernameFind){
                            return res.status(200).send({message: 'Nombre de usuario en uso'});
                        }else{
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(userUpdated){
                                    return res.status(401).send({message: 'Usuario actualizado'});
                                }else{
                                    return res.status(401).send({message: 'No se actualizó el usuario'});
                                }
                            })
                        }
                    })
                }else{
                    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            return res.status(401).send({message: 'Usuario actualizado'});
                        }else{
                            return res.status(401).send({message: 'No se actualizó el usuario'});
                        }
                    })
                } 
        }
    }   
}


function searchUser(req, res){
    var params = req.body;
    var userId = req.params.id;
    if(userId != req.user.sub){
        res.status(500).send({message: 'No posees permisos para realizar acciones de administrador'})
    }else{
    if(params.search){
        User.find({$or:[{name: params.search},
            {lastname: params.search},
        {username: params.search},
    ]}, (err, resultsSearch)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err})
            }else if(resultsSearch){
                return res.send({resultsSearch})
            }else{
                return res.status(404).send({message:'No hay registros para mostrar'})
            }
        })
    }else{
        return res.status(403).send({message:'Ingresa algún dato en el campo de búsqueda'})
    }
    }
}

function getUsers(req, res){
        User.find({}).exec((err, user)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'})
            }else if(user){
                res.status(200).send({message: 'Usuarios encontrados', user})
            }else{
                res.status(200).send({message: 'No hay registros'})
            }
        }) 
    }

function uploadImage(req, res){
        var userId = req.params.id;
        var fileName = 'Sin imagen';
    
        if(userId != req.user.sub){
            res.status(403).send({message: 'No puede acceder a esta funcion'});
        }else{
            if(req.files){
                var filePath = req.files.image.path;
                var fileSplit = filePath.split('\\');
                var fileName = fileSplit[2];
                var ext = fileName.split('.');
                var fileExt = ext[1];
                if( fileExt == 'png' ||
                    fileExt == 'jpg' || 
                    fileExt == 'jpeg' ||
                    fileExt == 'gif'){
                        User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'});
                            }else if(userUpdated){
                                return res.send({user: userUpdated, userImage: userUpdated.image});
                            }else{
                                return res.status(404).send({message: 'No se actualizó la imagen'});
                            }
                        })
                    }else{
                        fs.unlink(filePath, (err)=>{
                            if(err){
                                return res.status(500).send({message: 'Error al eliminar y la extensión no es válida'});
                            }else{
                                return res.status(403).send({message: 'Extensión no válida, y archivo eliminado'});
                            }
                        })
                    }
            }else{
                return res.status(404).send({message: 'No has subido una imagen'});
            }
        }
    }  
    
function getImage(req, res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/' + fileName;
    
        fs.exists(pathFile, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(pathFile))
            }else{
               return res.status(404).send({message: 'Imagen inexistente'});
            }
        })
    }


    

module.exports = {
    createInit, 
    saveUser, 
    login,
    updateUser,
    removeUserAdmin,
    createInitAdminH,
    updateUserAdmin,
    searchUser,
    getUsers,
    updateUserU,
    removeUser,
    uploadImage,
    getImage
    /*,
   
    
    uploadImage,
    getImage **/
}