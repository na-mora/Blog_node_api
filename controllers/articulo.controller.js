'use strict';

const Articulo = require('../models/Articulo');
const validator = require('validator');

const fs = require('fs'); // File system
const path = require('path');

// Objeto de funciones
const controlador = {

    guardarArticulo: (request, response)=>{

        // Recojemos los parametros
        const valores = request.body;
        // Validamos los datos
        try{
            const validarNombre = !validator.isEmpty(valores.nombre);
            const validarDescripcion = !validator.isEmpty(valores.descripcion);

            if(validarNombre && validarDescripcion){

                const articulo = new Articulo();

                articulo.nombre = valores.nombre;
                articulo.descripcion = valores.descripcion;
                articulo.imagen = null;
                
                // Guardamos en mongodb
                const guardado = articulo.save((error, articuloGuardado)=>{
                    if(error || !articuloGuardado){
                        return response.status(200).send({
                            status: "error", mensaje: "No se ha podido guardar"})
                    }
                });

                return response.status(200).send(guardado);
            }
            else{
                return response.status(200).send("Faltan datos en el post");
            }
        }
        catch(error){
            response.status(200).send({
                status: "error",
                mensaje: 'Se ha producido un error en la validacion'
            });
        }
    },

    darArticulos: (request, response)=>{

        // Find
        Articulo.find({}).sort('-_id').exec((error, articulos)=>{

            if(error){
                return response.status(500).send({
                    status: "error",
                    mensaje: "Se ha producido un error"
                });
            }
            else if( !articulos){
                return response.status(404).send({
                    status: "warning",
                    mensaje: "No hay articulos en la base de datos"
                });
            }
            return response.status(200).send(articulos);
        });

    },

    darUltimosArticulos: (request, response)=>{
        let ultimos = request.params.last;

        if(ultimos || ultimos!= undefined){
            const query = Articulo.find({});
            // Limitamos los datos
            query.limit(ultimos);

            query.sort('-_id').exec((error, articulos)=>{
                if(error){
                    return response.status(500).send({
                        status: "error",
                        mensaje: "Se ha producido un error"
                    });
                }
                else if( !articulos){
                    return response.status(404).send({
                        status: "warning",
                        mensaje: "No hay articulos en la base de datos"
                    });
                }
                return response.status(200).send(articulos);
            });
            
        }
        else{
            // Si ultimos no existe
        }

    },

    darArticulo: (request, response)=>{
        const id = request.params.id;

        if(!id || id==null || id==undefined){
            return response.status(404).send({
                status: 'error',
                mensaje: 'Error en el id'
            });
        }
        else{
            Articulo.findById(id, (error, articulo)=>{
                if(error){
                    return response.status(500).send({
                        status: "error",
                        mensaje: "Error al buscar el articulo"
                    });
                }
                else if(!articulo){
                    return response.status(404).send({
                        status: "error",
                        mensaje: "El articulo no existe"
                    });
                }

                return response.status(200).send(articulo);
            });
        }
        

    },

    actualizarArticulo: (request, response)=>{

        const id = request.params.id;

        const datos = request.body;

        try{
            const validarNombre = !validator.isEmpty(datos.nombre);
            const validarDescripcion = !validator.isEmpty(datos.descripcion);

            if(validarNombre && validarDescripcion){

                // Realizamos la actualizacion
                Articulo.findOneAndUpdate({_id: id}, datos, {new: true}, (error, actualizado)=>{
                    if(error){
                        return response.status(201).send({
                            status: "error",
                            mensaje: "Error en la actualizacion"
                        });
                    }
                    else if(!actualizado){
                        return response.status(404).send({
                            status: "error",
                            mensaje: "El articulo no se actualizo"
                        })
                    }
                    else{
                        // Todo sale bien 
                        return response.status(201).send(actualizado);
                    }
                });
            }
            else{
                return response.status(201).send({
                    status:  "error",
                    mensaje: "Los valores no son validos"
                });
            }
        }
        catch(error){
            return response.status(201).send({
                status: "error",
                mensaje: "Error al hacer la actualizacion"
            });
        }
        
    },

    eliminarArticulo: (request, response)=>{
        const id = request.params.id;

        // Eliminamos
        Articulo.findOneAndDelete({_id: id},(error, eliminado)=>{
            if(error){
                return response.status(500).send({
                    status: "error",
                    mensaje: "Error al intentar eliminar"
                });
            }
            else if(!eliminado){
                return response.status(404).send({
                    status: "error",
                    mensaje: "El articulo no fue eliminado"
                });
            }
            else{
                return response.status(200).send(eliminado);
            }
        });
        
    },

    subirImagen: (request, response)=>{
        // Configurar el multiparty en rutas

        // Recojer el fichero
        const fileNombre = 'imagen no subida';
        if(!request.files){
            return response.status(404).send({
                status: "error",
                mensaje: "No se ha subido ninguna imagen"
            });
        }
        //Conseguir el nombre y la extension del archivo
        const file_path = request.files.imagen.path; 

        // En linux split('/')
        const file_split = file_path.split('\\');

        const file_nombre = file_split[2];

        const extension_split = file_nombre.split('\.');

        const fileExtension = extension_split[1];
        // Validar la extension

        if(fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension!= 'gif'){
            // Borramos el archivo
            fs.unlink(file_path, (error)=>{
                return response.status(500).send({
                    status: "error",
                    mensaje: "La extension de la imagen no es valida"
                })
            });


        }
        else{
            // Agregamos la imagen a mongodb buscando por id
            const id = request.params.id;
            
            Articulo.findOneAndUpdate({_id: id}, {imagen: file_nombre}, {new: true}, (error, actualizado)=>{
                
                if(error || !actualizado){
                    
                    return response.status(500).send({
                        status: "error",
                        mensaje: "Se ha producido un error al actualizar la base de datos "
                    });
                }
                
                return response.status(200).send(actualizado);
            });
            
        }
    },

    darImagen: (request, response)=>{
        const nombreImagen = request.params.nombreImagen;

        const path_file = './upload/articulos/'+nombreImagen;

        fs.exists(path_file, (existe)=>{
            if(existe){
                // La encontro
                return response.sendFile(path.resolve(path_file));
            }
            else{
                return response.status(404).send({
                    status: "error",
                    mensaje: "La imagen no existe"
                });
            }
        });
    },

    buscar: (request, response)=>{
        const busqueda = request.params.busqueda;

        // Busqueda por cualquier criterio
        Articulo.find({
            "$or": [
                {"nombre": {"$regex": busqueda, "$options": "i"}},
                {"descripcion": {"$regex": busqueda, "$options": "i"}}
            ]
        }).sort([['createdAt', 'descending']]).exec((error, articulos)=>{
            if(error){
                return response.status(500).send({
                    status: "error",
                    mensaje: "Se ha producido un error en mongodb"
                })
            }
            else if(!articulos.lenght){
                return response.status(404).send({
                    status: "error",
                    mensaje: "No hay elementos por este criterio"
                });
            }
            return response.status(200).send(articulos);
        });
    }


}

// Exportamos
module.exports = controlador;