/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.preguntasBorradas = new Evento(this);
  this.preguntaEditada = new Evento (this);
  this.respuestaVotada = new Evento (this);



  this.traerPreguntasGuardadas();
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    let data = this.preguntas.length;
    if (data == 0){
      return -1;
    } else {
      for(let i=0; i<this.preguntas.length;i++){
      data = this.preguntas[i].id;
    }
  }
  return data;
  },

  traerPreguntasGuardadas: function () {
    let preguntasAnteriores = localStorage.getItem('preguntas')
    if (preguntasAnteriores) {
      this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
    } else {
      localStorage.setItem('preguntas','[]');
    }
  },

  //Se actualiza el array de preguntas.
  guardar: function() {
    this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
  },

  //Se actualiza el storage cuando se suma una nueva pregunta
  agregarAlStorage: function (nuevaPregunta){
    let preguntasParseadas = JSON.parse(localStorage.getItem('preguntas'));
    preguntasParseadas.push(nuevaPregunta);
    localStorage.setItem('preguntas',JSON.stringify(preguntasParseadas));
  },

  borrarUnaDelStorage: function (id) {
    let preguntasParseadas = JSON.parse(localStorage.getItem('preguntas'));
    let preguntaABorrar = preguntasParseadas.find((pregunta) => pregunta.id==id);
    let preguntasActualizadas = preguntasParseadas.filter ((pregunta)=> pregunta != preguntaABorrar);
    console.log (preguntasActualizadas);
    localStorage.setItem('preguntas', JSON.stringify(preguntasActualizadas));

  },

  borrarTodasDelStorage: function () {
    localStorage.setItem('preguntas', '[]');
  },

  editarDelStorage: function (textoNuevaPregunta, idPreguntaVieja) {
    let preguntasParseadas = JSON.parse(localStorage.getItem('preguntas'));
    let preguntaAActualizar = preguntasParseadas.find((pregunta) => pregunta.id==idPreguntaVieja);
    preguntaAActualizar.textoPregunta = textoNuevaPregunta;
    localStorage.setItem('preguntas', JSON.stringify(preguntasParseadas));
  },

  //Revisar esta función: puedo acceder a los votos de la respuesta, pero no se guarda en el LS.
  votarStorage: function (nombrePregunta, respuestaSeleccionada){
    let preguntasParseadas = JSON.parse(localStorage.getItem('preguntas'));
    let preguntaAActualizar = preguntasParseadas.find((pregunta) => pregunta.textoPregunta==nombrePregunta);
    preguntaAActualizar.cantidadPorRespuesta.find((respuesta) => respuesta.textoRespuesta == respuestaSeleccionada).cantidad++
    localStorage.setItem('preguntas', JSON.stringify(preguntasParseadas));
  },


  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(textoPreguntaAgregada, respuestasPreguntaAgregada) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': textoPreguntaAgregada, 'id': id, 'cantidadPorRespuesta': respuestasPreguntaAgregada};
    this.agregarAlStorage(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se borra una pregunta según su ID
  borrarPregunta: function (idPreguntaBorrada) {
    this.borrarUnaDelStorage(idPreguntaBorrada);
    this.guardar();
    this.preguntaBorrada.notificar();
  },

  borrarTodo: function () {
    this.borrarTodasDelStorage();
    this.guardar();
    this.preguntasBorradas.notificar();
  },


  editarPregunta: function (idPreguntaEditada, textoNuevaPregunta) {
    this.editarDelStorage(textoNuevaPregunta, idPreguntaEditada);
    this.guardar();
    this.preguntaEditada.notificar();
  },

  agregarVoto: function (nombrePregunta, respuestaSeleccionada){
    this.votarStorage (nombrePregunta, respuestaSeleccionada);
    this.guardar();
    this.respuestaVotada.notificar();
  },
}