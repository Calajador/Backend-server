// requieres 
var express = require('express');
var mongoose = require('mongoose');


// Inicializar Variables
var app = express();


// Conexion Base de Datos
 mongoose.connection.openUri('mongodb://localhost: 27017/hospitalDB',{ useNewUrlParser: true }, (err, res) => {

 if(err) throw err;

 console.log('Base de datos: \x1b[32m%s\x1b[0m ' , 'online');

 });


//Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok:true,
        mensaje: 'Peticion aceptada correctamente'
    });
});


// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Servidor Puerto 3000: \x1b[32m%s\x1b[0m ' , 'online');
});