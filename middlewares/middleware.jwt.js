const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const llaveSecreta = require('../config');

const middleware = {
    validarToken: async (request, response, next)=>{
        const token = request.headers["x-access-token"];

        if(token){
            const decodificado = jwt.verify(token, llaveSecreta);
            const id = decodificado.id;

            const buscarUsuario = await Usuario.findById(id, {password: 0});
            if(buscarUsuario){
                console.log(token);
                next();
            }
            else{
                return response.status(200).send({
                    status: "error",
                    mensaje: "El usuario no existe"
                });
            }
        }
        else{
            return response.status(403).send({
                status: "error",
                 mensaje: "No hay token"
            });
        }
    },
    validarEmail: async(request, response, next)=>{
        
    }
}

module.exports = middleware;