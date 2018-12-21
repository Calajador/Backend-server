var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;
var personalSchema =	new Schema({
				nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
				img: {	type: String,	required: false },
				usuario: {	type: Schema.Types.ObjectId,	ref: 'Usuario',	required: false },
				departamento: {	type: Schema.Types.ObjectId,	ref: 'Departamento',	required: [true,	'El	id	departamento	es	un	campo	obligatorio']	}
});
module.exports =	mongoose.model('Personal',	personalSchema);