export default {
  affected: {
    form: {
      submit: 'Actualizar datos',
      fever: {
        label: 'Cuánta fiebre tienes?',
        placeholder: 'Fiebre',
        hint: 'Dinos cuánta fiebre tienes ahora, para poder monitorizar tu evolución.'
      }
    }
  },
  patient: {
    data: {
      speciality: {
        label: 'Especialidad seleccionada'
      }
    }
  },
  risk: {
    actions: {
      help: {
        title: 'Necesitas ayuda?',
        description: 'Si necesitas que te ayudemos con la compra, con el paseo de animales, o alguna otra cosa, indícanos cómo podemos ayudarte, y pulsa el botón. Intentaremos que un voluntario te ayude enseguida.',
        awaitingTitle: 'Tienes una petición pendiente',
        data: {
          requestSummary: 'Tu petición',
          volunteerName: 'Te va a ayudar',
          allDone: 'Todo listo?',
          finishRequest: 'Cerrar petición'
        },
        form: {
          submit: 'Enviar petición',
          reason: {
            label: 'Qué necesitas?',
            placeholder: 'Indícanos cómo podemos ayudarte',
            hint: 'Trata de especificar lo más posible lo que necesitas. Los voluntarios que estén cerca de ti verán tu mensaje y decidirán si pueden ayudarte.'
          }
        },
        errors: {
          noData: 'Debes decirnos en qué podemos ayudarte',
          unknown: 'Ha ocurrido un error al guardar tu petición. Inténtalo de nuevo.'
        },
        success: 'Hemos recibido tu petición. Te mantendremos informado.'
      }
    }
  }
}