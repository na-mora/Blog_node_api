'use strict'
// Solamamente necesito las rutas
const {Router} = require('express');
const multiparty = require('connect-multiparty');
const controlador = require('../controllers/articulo.controller');

const router = Router();

// Configuracion del multiparty
const md_subirImagen = multiparty({uploadDir: './upload/articulos' });

/// Rutas para los articulos
router.post('/', controlador.guardarArticulo);
router.get('/', controlador.darArticulos);
router.get('/ultimos/:last?', controlador.darUltimosArticulos);
router.get('/:id', controlador.darArticulo);
router.put('/:id', controlador.actualizarArticulo);
router.delete('/:id', controlador. eliminarArticulo);

// Guardar un recurso en el api
router.post('/guardar-imagen/:id',md_subirImagen, controlador.subirImagen);
router.get('/obtener-imagen/:nombreImagen', controlador.darImagen);

// Bucador
router.get('/buscar/:busqueda', controlador.buscar);

// Exportamos el modulo
module.exports = router;

