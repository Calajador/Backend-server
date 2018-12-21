var express = require('express');

var app = express();

var Personal = require('../models/personal');

var mdAutenticacion = require('../middlewares/autenticacion');


// ============================
// Obtener Todos los personals
// ============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Personal.find({})
    .populate('departamento')
    .skip(desde)
    .limit(5)
    .exec(
        
        (err, personals) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando personals',
                errors: err
            });
        }

        Personal.count({}, (err,conteo) => {

            res.status(200).json({
                ok:true,
                personals: personals,
                total:conteo
            });
        })

    })

});


// ============================
// Actualizar personal
// ============================

app.put('/:id', mdAutenticacion.verificarToken ,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Personal.findById(id, (err, personal) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error buscando personals',
                errors: err
            });
        }

        if(!personal) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El personal con el id: '+id +'no existe',
                errors: {message: ' no existe personal con ese ID'}
            });
        }


        personal.nombre = body.nombre;
        // personal.nombre = req.usuario._id;
        personal.departamento = body.departamento;
        

        personal.save( (err, personalGuardado) => {

            if(err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar personal',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                personal: personalGuardado
            });

        });

    });

    
});


// ============================
// Crear nuevo personal
// ============================

app.post('/', mdAutenticacion.verificarToken , (req,res) => {

    var body = req.body;

    var personal = new Personal ({
        nombre: body.nombre,
        // usuario: req.usuario._id
        departamento: body.departamento
    });

    personal.save( (err, personalGuardado) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error creando personals',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            personal: personalGuardado
        });
    })

})

// ============================
// Borrar un personal por el ID
// ============================

app.delete( '/:id', mdAutenticacion.verificarToken ,(req, res) => {

    var id = req.params.id;

    Personal.findByIdAndRemove( id, ( err, personalBorrado ) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error borrando personals',
                errors: err
            });
        }

        if(!personalBorrado) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe personal con ese id',
                errors: {message: 'No existe un personal con ese id'}
            });
        }

        res.status(200).json({
            ok:true,
            personal: personalBorrado
        });

    });
});

module.exports = app;