var express = require('express');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var app = express();

var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// ============================
// Autentinficacion con Google
// ============================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
            .catch(e => {
                return  res.status(403).json({
                    ok:false,
                    mensaje: 'Token no valido'
            });
        })


    Usuario.findOne( {email: googleUser.email}, (err, usuarioBD) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usuarios usuarios',
                errors: err
            });
        }

        if (usuarioBD) {

            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Debe usar la autentificacion normal'
                });
            }else {
                var token = jwt.sign({usario: usuarioBD}, SEED ,{expiresIn: 14400}) // 4 horas de token

                res.status(200).json({
                    ok:true,
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD._id
                });
            }
        }else {
            // Hay que crear un usuario
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save( (err, usuarioBD) => {
                var token = jwt.sign({usario: usuarioBD}, SEED ,{expiresIn: 14400}) // 4 horas de token

                res.status(200).json({
                    ok:true,
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD._id
                });
            });


        }
    })

    //   return  res.status(200).json({
    //     ok:true,
    //     mensaje: 'Ok',
    //     googleUser: googleUser
    // });
})



// ============================
// Autentinficacion Normal
// ============================

app.post('/', ( req, res ) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usuarios usuarios',
                errors: err
            });
        }

        if( !usuarioBD ) {

            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioBD.password)) {

            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // crear Token
        usuarioBD.password = ':)';

        var token = jwt.sign({usario: usuarioBD}, SEED ,{expiresIn: 14400}) // 4 horas de token

        res.status(200).json({
            ok:true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });

    });



});



module.exports = app;

