'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'Kinalito';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.username,        
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(24, 'hour').unix()
    }
    return jwt.encode(payload, secretKey);
}

