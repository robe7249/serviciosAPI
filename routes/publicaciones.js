
const router = require('express').Router();
const {
  crearPublicacion,
  obtenerPublicaciones,
  modificarPublicacion,
  eliminarPublicacion
} = require('../controllers/publicaciones')
var auth = require('./auth');

router.get('/', auth.opcional, obtenerPublicaciones)
router.get('/:id', auth.opcional, obtenerPublicaciones)// nuevo endpoint con todos los detalles de publicacion
router.post('/', auth.requerido, crearPublicacion)
router.put('/:id', auth.requerido, modificarPublicacion)
router.delete('/:id', auth.requerido, eliminarPublicacion)

module.exports = router;