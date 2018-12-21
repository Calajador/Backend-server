var express = require('express');

var app = express();

var Departamento = require('../models/departamento');
var Personal = require('../models/personal');
var Usuario = require('../models/usuario');


// ================================
// Busqueda especifica
// ================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp (busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
        promesa = buscarUsuario(busqueda,regex);
        break;

        case 'personal':
        promesa = buscarPersonal(busqueda, regex);
        break;

        case 'departamentos':
        promesa = buscarDepartamentos(busqueda, regex);
        break;

        default:
        return res.status(400).json({
            ok:false,
            mensaje: ' Los tipos de busqueda son solo Usuario, Personal y Departamento',
            error: {message: 'Tipo de tabla/coleccion no valido'}
        });
    }

    promesa.then( data => {

        res.status(200).json({
            ok:true,
            [tabla]: data
        });
    });
});




// ================================
// Busqueda general
// ================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp (busqueda, 'i');


    Promise.all([ buscarDepartamentos(busqueda, regex),
                  buscarPersonal(busqueda, regex),
                  buscarUsuario(busqueda, regex)
                ])
            .then(respuestas => {

                res.status(200).json({
                    ok:true,
                    departamento:respuestas [0],
                    personal: respuestas [1],
                    usuario: respuestas[2]
                });
            })
});


function buscarDepartamentos(busqueda, regex) {

    return new Promise( (resolve,reject) => {
      
        Departamento.find({ nombre:regex }, (err, departamentos) => {
    
            if (err) {
                reject('error al buscar departamentos', err);
            }else {
                resolve(departamentos);
            }
        });
    });
}

function buscarPersonal(busqueda, regex) {

    return new Promise( (resolve,reject) => {
      
        Personal.find({ nombre:regex }, (err, personal) => {
    
            if (err) {
                reject('error al buscar personal', err);
            }else {
                resolve(personal);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {

    return new Promise( (resolve,reject) => {
      
        Usuario.find({}, 'nombre email role')
               .or([ {'nombre': regex}, {'email': regex} ])
               .exec( (err, usuarios) => {

                if(err) {
                    reject('erroro al buscar usuario', err);
                }else{
                    resolve(usuarios);
                }
             });
    });
}

module.exports = app;