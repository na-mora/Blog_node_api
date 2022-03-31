// Conexion a la base de datos
'use strict';

const mongoose = require('mongoose');

const app = require('./app');
const puerto = 3000;

let url='mongodb://localhost:27017/api-rest-blog';
let opciones = {
    useNewUrlParser: true
};


// Uso se promesas (Previene errores)
mongoose.Promise = global.Promise;
// Conexion con la base de datos
mongoose.connect(url, opciones).then(
    ()=>{
        console.log('Conexion establecida mongo: ', 27017);
        app.listen(puerto, ()=>{
            console.log('Escuchando en: ', puerto);
        });
    });


