'use strict';

// Cargamos modulos de node para crear servidor
const express = require('express');
const bodyParser = require('body-parser');
// Traemos las rutas
const rutasArticulo = require('./routes/articulo.routes');
const rutasUsuario = require('./routes/usuario.routes');

const morgan = require('morgan');

// Ejecutar express
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CORS (Permitir consumir el api rest)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijos a la rutas
app.use('/api/articulos',rutasArticulo);
app.use('/api/usuarios', rutasUsuario);

// Exportar eset modulo
module.exports = app;