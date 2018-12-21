var express = require('express');

var app = express();

var fileUpload = require('express-fileupload');

var fs = require('fs');


var Usuario = require('../models/usuario');
var Personal = require('../models/personal');
var Departamento = require('../models/departamento');


// default options
app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion permitidos
    var tiposValidos = ['departamentos', 'personal', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Tipo de coleccion no valida',
            errors: {message: 'Tipo de coleccion no valida'}
        });
    }

    if(!req.files) {

        return res.status(400).json({
            ok:false,
            mensaje: 'No has seleccionado nada',
            errors: {message: 'Debe de seleccionar un archivo'}
        });
    }

    // obtener nombre de archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado [nombreCortado.length -1];


    // Extensiones permitidas
    var extensionsValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionsValidas.lastIndexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok:false,
            mensaje: 'Formato no valido',
            errors: {message: 'Los formatos validos son ' + extensionsValidas.join('. ')}
        });
    }

    // Nombre de Archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    // Mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if(err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al subir archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if(tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if(!usuario) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Usuario no encontrado',
                    errors: { message:'Usuario no encontrado'}
                });
            }

            var pathViejo = './uploads/usuarios' + usuario.img;

            // si existe archivo anterior se borra
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

               return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario:usuarioActualizado
                });
            });

        });
    }

    if(tipo === 'departamentos') {

        Departamento.findById(id, (err, departamento) => {

            if(!departamento) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Departamento no encontrado',
                    errors: { message:'Departamento no encontrado'}
                });
            }

            var pathViejo = './uploads/departamentos' + departamento.img;

            // si existe archivo anterior se borra
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            departamento.img = nombreArchivo;

            departamento.save((err, departamentoActualizado) => {

               return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de departamento actualizada',
                    departamento:departamentoActualizado
                });
            });

        });      
    }
    
    if(tipo === 'personal') {

        Personal.findById(id, (err, personal) => {

            if(!personal) {
                return res.status(400).json({
                    ok:true,
                    mensaje: 'Personal no encontrado',
                    errors: { message:'Personal no encontrado'}
                });
            }

            var pathViejo = './uploads/personals' + personal.img;

            // si existe archivo anterior se borra
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            personal.img = nombreArchivo;

            personal.save((err, personalActualizado) => {

               return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de personal actualizada',
                    personal:personalActualizado
                });
            });

        });      
    }
}





module.exports = app;