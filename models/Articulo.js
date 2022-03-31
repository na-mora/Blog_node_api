'use strict';
const {Schema, model} = require('mongoose');

const articuloEschema = new Schema({
    nombre: String,
    descripcion: String,
    date: {
        Type: Schema.Types.Date
    },
    imagen: String
},{
    timestamps: true,
    versionKey: false
});

module.exports = model('Articulo', articuloEschema);
