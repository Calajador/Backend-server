var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var rolesPermitidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido'
};


var usuarioSchema = new Schema ({

    nombre: {type: String, required: [true, "El nombre es necesario"]},
    email: {type: String, unique: true, required: [true, "El email es necesario"]},
    password: {type: String, required: [true, "La contraseña es necesario"]},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesPermitidos}
});

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} el email debe de ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
