var router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Bienvenido a ofertar o contratar servicios');
});

router.use('/usuarios', require('./usuarios'));
router.use('/publicaciones', require('./publicaciones'));
router.use('/solicitudes', require('./solicitudes'));


module.exports = router;
