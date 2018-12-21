var express = require('express');

var app = express();

var Departamento = require('../models/departamento');

var mdAutenticacion = require('../middlewares/autenticacion');


// ============================
// Obtener Todos los departamentos
// ============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Departamento.find({})
    .skip(desde)
    .limit(5)
    .exec(
        
        (err, departamentos) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error cargando departamentos',
                errors: err
            });
        }

        Departamento.count({}, (err, conteo) => {

            res.status(200).json({
                ok:true,
                departamentos: departamentos,
                total: conteo
            });
        })

    })

});


// ============================
// Actualizar departamento
// ============================

app.put('/:id', mdAutenticacion.verificarToken ,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Departamento.findById(id, (err, departamento) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error buscando departamentos',
                errors: err
            });
        }

        if(!departamento) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El departamento con el id: '+id +'no existe',
                errors: {message: ' no existe departamento con ese ID'}
            });
        }


        departamento.nombre = body.nombre;
        // departamento.nombre = req.usuario._id;
        

        departamento.save( (err, departamentoGuardado) => {

            if(err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar departamento',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                departamento: departamentoGuardado
            });

        });

    });

    
});


// ============================
// Crear nuevo departamento
// ============================

app.post('/', mdAutenticacion.verificarToken , (req,res) => {

    var body = req.body;

    var departamento = new Departamento ({
        nombre: body.nombre,
        // usuario: req.usuario._id
    })

    departamento.save( (err, departamentoGuardado) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error creando departamentos',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            departamento: departamentoGuardado
        });
    })

})

// ============================
// Borrar un departamento por el ID
// ============================

app.delete( '/:id', mdAutenticacion.verificarToken ,(req, res) => {

    var id = req.params.id;

    Departamento.findByIdAndRemove( id, ( err, departamentoBorrado ) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error borrando departamentos',
                errors: err
            });
        }

        if(!departamentoBorrado) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No existe departamento con ese id',
                errors: {message: 'No existe un departamento con ese id'}
            });
        }

        res.status(200).json({
            ok:true,
            departamento: departamentoBorrado
        });

    });
});

module.exports = app;