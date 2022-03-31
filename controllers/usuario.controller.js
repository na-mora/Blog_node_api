'use strict';
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const llaveSecreta = require('../config');

const controlador = {

    // Guardar un usuario nuevo
    registro: async (request, response)=>{
        const valores = request.body;

        const existe = await Usuario.exists({email: valores.email });

        if(existe){
            return response.status(200).send({
                status: "error",
                mensaje: "Este usuario ya esta registrado"
            });
        }
        else{
            try{
                const validarNombre = !validator.isEmpty(valores.nombre);
                const validarApellidos = !validator.isEmpty(valores.apellidos);
                const validarEmail = !validator.isEmpty(valores.email);
                const validarContrasena = !validator.isEmpty(valores.contrasena);

                if(validarNombre && validarApellidos && validarEmail && validarContrasena){
                    
                    const contrasenaCifrada = await cifrarContrasena(valores.contrasena);
                    const usuario = new Usuario({
                        nombre: valores.nombre,
                        apellidos: valores.apellidos,
                        email: valores.email,
                        contrasena: contrasenaCifrada});

                    await usuario.save((error, usuarioGuardado)=>{
                        if(error || !usuarioGuardado){
                            console.log(error);
                            return response.status(200).send({
                                status: "error",
                                mensaje: "Se ha producido un error al guardar en la base de datos"
                            });
                        }
                        else{
                            
                            // Creamos el token 
                            const token = jwt.sign({id: usuarioGuardado._id}, llaveSecreta, {
                                expiresIn: 86400 //24 horas
                            });

                            //Enviamos el token 
                            return response.status(200).send({token});
                        }
                    });
                    
                }
                else if(validarNombre == false){
                    return response.status(200).send({
                        status: "error", 
                        mensaje: "Hace falta el nombre"
                    });
                }
                else if(validarApellidos == false){
                    return response.status(200).send({
                        status: "error", 
                        mensaje: "Hace falta en apellidos"
                    });
                }
                else if(validarEmail ==  false){
                    return response.status(200).send({
                        status: "error", 
                        mensaje: "Hace falta el email"
                    });
                }
                else if(validarContrasena == false){
                    return response.status(200).send({
                        status: "error", 
                        mensaje: "Hace falta la contrasena"
                    });
                }
            }
            catch(error){
                console.log(error);
                response.status(200).send({
                    status: "error",
                    mensaje: "Error al intentar validar los datos"
                });
            }
        }

    },

    login: async (request, response)=>{
        const email = request.body.email;

        // Encontrar el usuario
        const existeUsuario = await Usuario.findOne({email: email});

        if(existeUsuario){
            const password = request.body.contrasena;
            const verdadera = existeUsuario.contrasena;

            const coincide = await compararContrasena(verdadera, password);
            if(coincide){
                //Creamos el token por 24 horas
                const token = jwt.sign({id: existeUsuario._id}, llaveSecreta, {
                    expiresIn: 86400 //24 horas
                });
                return response.status(200).send({token});
            }
            else{
                return response.status(200).send({
                    status: "error",
                    mensaje: "Contrasena incorrecta"
                });
            }
        }
        else{
            return response.status(200).send({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }
        
    }

}

// Metodos axuliares para el registro y el login
const cifrarContrasena = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const nueva = await bcrypt.hash(password, salt);
    return nueva;
}

const compararContrasena = async (password, recibida)=>{
    const esIgual = await bcrypt.compare(recibida, password);
    return esIgual;
}

module.exports = controlador;