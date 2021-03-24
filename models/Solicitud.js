

const mongoose = require("mongoose");

var SolicitudSchema = new mongoose.Schema(
  {
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Publicacion",
    },
    anunciante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    estado: { type: String, enum: ["aceptada", "cancelada", "pendiente"] },
  },
  { collection: "solicitudes", timestamps: true }
);

SolicitudSchema.methods.publicData = function () {
  return {
    id: this.id,
    idPublicacion: this.idPublicacion,
    fechaCreacion: this.fechaCreacion,
    idAnunciante: this.idAnunciante,
    idSolicitante: this.idSolicitante,
    estado: this.estado
  };
};

mongoose.model('Solicitud', SolicitudSchema)