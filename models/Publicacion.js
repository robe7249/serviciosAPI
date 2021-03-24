

const mongoose = require("mongoose");

const PublicacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // nombre de la publicacion (o titulo del anuncio)
  categoria: { type: String, enum: ['perro', 'gato', 'otro'] }, // perro | gato | otro
  fotos: [String], // links a las fotografías
  descripcion: { type: String, required: true }, // descripción del anuncio
  anunciante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // contacto con la persona que anuncia al animalito
  ubicacion: { type: String }, // muy importante
  estado: { type: String, enum: ['adoptado', 'disponible', 'pendiente'] },
}, { timestamps: true })

PublicacionSchema.methods.publicData = function () {
  return {
    id: this.id,
    nombre: this.nombre,
    categoria: this.categoria,
    fotos: this.fotos,
    descripcion: this.descripcion,
    anunciante: this.anunciante,
    ubicacion: this.ubicacion,
    estado: this.estado
  };
};

mongoose.model('Publicacion', PublicacionSchema)