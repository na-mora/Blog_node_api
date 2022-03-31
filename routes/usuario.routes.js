'use strict'
const {Router} = require('express');
const controlador = require('../controllers/usuario.controller');
const {middleware} = require('../middlewares/middleware.jwt');


const router = Router();

// Rutas
router.post('/registro', controlador.registro); 
router.post('/login', controlador.login); 

// Exportamos el modulo
module.exports = router;