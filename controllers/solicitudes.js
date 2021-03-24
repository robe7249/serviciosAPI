

const mongoose = require("mongoose");
const Usuario = mongoose.model('Usuario')
const Solicitud = mongoose.model('Solicitud')
const Publicacion = mongoose.model('Publicacion')
mongoose.set('useFindAndModify', false);

function crearSolicitud(req, res, next) { // POST v1/solicitudes?publicacion_id=021abo59c96b90a02344...
  // Buscamos la publicacion a solicitar
  Publicacion.findById(req.query.publicacion_id, async (err, publicacion) => {
    if (!publicacion || err) {
      return res.sendStatus(404)
    }
    if (publicacion.estado==='adoptado') {
      return res.sendStatus('La publicacion ya ha sido adoptada')
    }
    // si está dispobible o pendiente podemos crear la solicitud
    const solicitud = new Solicitud()
    solicitud.publicacion = req.query.publicacion_id
    solicitud.anunciante = publicacion.anunciante
    solicitud.solicitante = req.usuario.id
    solicitud.estado = 'pendiente'
    solicitud.save().then(async s => {
      // antes de devolver respuesta actualizamos el tipo de usuario a anunciante
      await Usuario.findOneAndUpdate({_id: req.usuario.id}, {tipo: 'anunciante'})
      res.status(201).send(s)
    }).catch(next)
  }).catch(next)
}


function obtenerSolicitud(req, res, next) {
  if (!req.params.id) {
    // sin :id, solo enlistaremos las solicitudes dónde el usuario es anunciante o solicitante
    Solicitud.find({ $or: [{ solicitante: req.usuario.id }, { anunciante: req.usuario.id }] }).then(solicitudes => {
      res.send(solicitudes)
    }).catch(next)
  } else {
    // Al obtener una solicitud individual con el :id poblaremos los campos necesarios
    Solicitud.findOne({ _id: req.params.id, $or: [{ solicitante: req.usuario.id }, { anunciante: req.usuario.id }] })
      .then(async (solicitud) => {
        // añadimos información sobre la publicacion
        await solicitud.populate('publicacion').execPopulate()
        if (solicitud.estado === 'aceptada') {
          // Si la solicitud ha sido aceptada, se mostrará la información de contacto
          await solicitud.populate('anunciante', 'username nombre apellido bio foto telefono email').execPopulate()
          await solicitud.populate('solicitante', 'username nombre apellido bio foto telefono email').execPopulate()
          res.send(solicitud)
        } else {
          res.send(solicitud)
        }
      }).catch(next)
  }
}



function modificarSolicitud(req, res, next) {
  console.log("Solicitud a solicitar: " + req.params.id )  

  Solicitud.findById(req.params.id).then(solicitud => {
    if (!solicitud) { return res.sendStatus(401); }

    console.log("Usuario solicita cambio solicitud: " + req.usuario.id);
    console.log("Usuario anunciante publicacion: " + solicitud.anunciante);

    if( req.usuario.id == solicitud.anunciante ){
      let nuevaInfo = req.body
      if (typeof nuevaInfo.idPublicacion !== 'undefined')
        solicitud.idPublicacion = nuevaInfo.idPublicacion
      if (typeof nuevaInfo.fechaDeCreacion !== 'undefined')
        solicitud.fechaDeCreacion = nuevaInfo.fechaDeCreacion
      if (typeof nuevaInfo.idUsuarioAnunciante !== 'undefined')
        solicitud.idUsuarioAnunciante = nuevaInfo.idUsuarioAnunciante
      if (typeof nuevaInfo.idUsuarioSolicitante !== 'undefined')
        solicitud.idUsuarioSolicitante = nuevaInfo.idUsuarioSolicitante
      if (typeof nuevaInfo.estado !== 'undefined')
        solicitud.estado = nuevaInfo.estado
      solicitud.save().then(updateSolicitud => {
        res.status(201).json(updateSolicitud.publicData())
      }).catch(next)
    }else{
      return res.sendStatus(401);
    }
  }).catch(next)
}


/*function eliminarSolicitud(req, res) {
    // Líneas que buscan una solicitud en la bd, una vez que lo encuenra lo elimina.
  res.status(200).send(`Solicitud ${req.params.id} eliminado`);
}*/

module.exports = {
  crearSolicitud,
  obtenerSolicitud,
  modificarSolicitud,
  //eliminarSolicitud,
  obtenerSolicitud
}