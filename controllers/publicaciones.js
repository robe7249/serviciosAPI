
const mongoose = require('mongoose')
const Publicacion = mongoose.model('Publicacion')

function crearPublicacion(req, res, next) {
  var publicacion = new Publicacion(req.body)
  publicacion.anunciante = req.usuario.id
  publicacion.estado = 'disponible'
  publicacion.save().then(publicacion => {
    res.status(201).send(publicacion)
  }).catch(next)
}

function obtenerPublicacion(req, res) {
  // Simulando dos Mascotas y respondiendolos
  var mascota1 = new Mascota(1, 'Nochipa', 'Perro', 'https://www.perrosrazapequeña.com/wp-content/uploads/2018/06/chihuahua-pelo-largo.jpg', 'bien bonita', '1', 'CDMX');
  res.send(mascota1)
}


function obtenerPublicaciones(req, res, next) {
  if (req.params.id) {
    Publicacion.findById(req.params.id)
      .populate('anunciante', 'username nombre apellido bio foto').then(publicaciones => {
        res.send(publicaciones)
      }).catch(next)
  } else {
    Publicacion.find().then(publicaciones => {
      res.send(publicaciones)
    }).catch(next)
  }
}


function modificarPublicacion(req, res, next) {
  console.log("Publicacion a modificar: " + req.params.id) //req.param.id - Publicacion en uri

  Publicacion.findById(req.params.id).then(publicacion => { //Busca la publicacion que se recibe como parámetro.

    if (!publicacion) { return res.sendStatus(401); }   //Si no se encuentra publicacion, retorna estaus 401.---

    let idUsuario = req.usuario.id;                   //User en JWT
    console.log("Usuario que modifica " + idUsuario);
    let idAnunciante = publicacion.anunciante;
    console.log(" Anunciante publicacion: " + idAnunciante);
    if (idUsuario == idAnunciante) {
      let nuevaInfo = req.body
      if (typeof nuevaInfo.nombre !== 'undefined')
        publicacion.nombre = nuevaInfo.nombre
      if (typeof nuevaInfo.categoria !== 'undefined')
        publicacion.categoria = nuevaInfo.categoria
      if (typeof nuevaInfo.fotos !== 'undefined')
        publicacion.fotos = nuevaInfo.fotos
      if (typeof nuevaInfo.descripcion !== 'undefined')
        publicacion.descripcion = nuevaInfo.descripcion
      if (typeof nuevaInfo.anunciante !== 'undefined')
        publicacion.anunciante = nuevaInfo.anunciante
      if (typeof nuevaInfo.ubicacion !== 'undefined')
        publicacion.ubicacion = nuevaInfo.ubicacion
      publicacion.save().then(updatedPublicacion => {
        res.status(201).json(updatedPublicacion.publicData())
      }).catch(next)
    }
    else {
      return res.sendStatus(401);
    }
  }).catch(next)
}


function eliminarPublicacion(req, res) {
  // únicamente borra a su propio publicacion obteniendo el id del token
  Publicacion.findById(req.params.id).then(publicacion => {

    if (!publicacion) { return res.sendStatus(401); }

    let idUsuario = req.usuario.id;
    console.log("Usuario que modifica " + idUsuario);
    let idAnunciante = publicacion.anunciante;
    console.log(" Anunciante publicacion: " + idAnunciante);

    if (idUsuario == idAnunciante) {
      let nombrePublicacion = publicacion.nombre;
      publicacion.deleteOne();
      res.status(200).send(`Publicacion ${req.params.id} eliminada. ${nombrePublicacion}`);
    } else {
      return res.sendStatus(401);
    }
  });


}


module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  modificarPublicacion,
  eliminarPublicacion,
  obtenerPublicacion
}