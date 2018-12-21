// requieres 
var express = require('express');
var mongoose = require('mongoose');


// Inicializar Variables
var app = express();
var bodyParser = require('body-parser');


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Imortar Rutas
var appRutes = require('./routes/app');
var usuarioRutes = require('./routes/usuario');
var loginRutes = require('./routes/login');
var departamentoRutes = require('./routes/departamento');
var personalrutes = require('./routes/personal');
var busquedaRutes = require('./routes/busqueda');
var uploadRutes = require('./routes/upload');
var imagenesRutes = require('./routes/imagenes');



// Conexion Base de Datos
 mongoose.connection.openUri('mongodb://localhost: 27017/hospitalDB',{ useNewUrlParser: true }, (err, res) => {

 if(err) throw err;

 console.log('Base de datos: \x1b[32m%s\x1b[0m ' , 'online');

 });


 // Server index config
//  var serveIndex = require('serve-index');
//  app.use(express.static(__dirname + '/'))
//  app.use('/uploads', serveIndex(__dirname + '/uploads'));



//Rutas
app.use('/usuario', usuarioRutes);
app.use('/departamento', departamentoRutes);
app.use('/personal', personalrutes);
app.use('/login', loginRutes);
app.use('/busqueda', busquedaRutes);
app.use('/upload', uploadRutes);
app.use('/img', imagenesRutes);

app.use('/', appRutes);


// Escuchar Peticiones
app.listen(3000, () => {
    console.log('Servidor Puerto 3000: \x1b[32m%s\x1b[0m ' , 'online');
});