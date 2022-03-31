'use strict';
const {Schema, model} = require('mongoose');
const bcryppt = require('bcrypt');

/**
 * Esquema que representa un Usuario
 */
const usuarioSchema = new Schema({
    nombre: {type: String, trim: true},
    apellidos: {type: String, trim: true},
    email: {type: String, unique: true ,trim: true},
    contrasena: String
},{
    timestamps: true,
    versionKey: false
});

//---------------------------------
// Metodos
//---------------------------------
async function cifrarContrasena (password) {
    const salt = await bcryppt.genSalt(10);
    const nueva = await bcryppt.hash(password, salt);
    return nueva;
}
/**
 * Metodo encargado de cifrar la contrasena antes de que 
 * ingrese a la base de datos 
 * @param {string} password Contrasena a ingresar
 * @returns Nueva contrasena cifrada
 */
usuarioSchema.static('cifrarContrasena', cifrarContrasena);


/**
 * Metodo encaragdo de comparar dos contrasenas 
 * @param {string} password Contrasena a ingresar
 * @param {*} recibido Contrasena recibida
 * @returns True si las contrasenas coinciden, false de lo
 * contrario
 */
usuarioSchema.method.compararContrasena = async (password, recibido)=>{
    const esIgual = await bcryppt.compare(recibido, password);
    return esIgual;
}

module.exports = model('Usuario', usuarioSchema);



