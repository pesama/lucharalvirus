export default {
  disclaimer: 'Por favor, utiliza esta herramienta de forma responsable. En estos tiempos de crisis cada minuto cuenta, y debemos minimizar el tiempo que malgastemos. Cada registro, comentario, o acción falsa nos lleva tiempo y esfuerzo, y pone en potencial riesgo a los demás. Si no te tomas en serio esta herramienta podremos tomar acciones legales.',
  loadingText: 'Tu cuenta está lista! Te estamos dirigiendo a la aplicación',
  headers: {
    signUp: 'Crea tu cuenta',
    confirmSignUp: 'Introduce el código que te hemos enviado'
  },
  form: {
    title: 'Necesitamos algunos datos',
    description: 'Por favor, rellena estos campos para que podamos entender mejor tu caso. Luego rellena los campos de la derecha para crear tu cuenta.'
  },
  fields: {
    name: {
      label: 'Tu nombre'
    },
    email: {
      label: 'Tu correo electrónico'
    },
    phoneNumber: {
      label: 'Tu teléfono'
    },
    address: {
      label: 'Tu Ciudad'
    },
    password: {
      label: 'Elige una contraseña'
    }
  },
  risk: {
    title: 'Registro como grupo de riesgo',
    description: 'Utiliza este formulario para registrarte como miembro de un grupo de riesgo. Intentaremos darte acceso a utilidades y herramientas para facilitar tu aislamiento, y seguiremos tu estado para saber que estás bien.',
    form: {
      reason: {
        label: 'Motivo del riesgo',
        placeholder: 'Dinos por qué estás en el grupo de riesgo',
        hint: 'Esto nos ayuda a determinar los diferentes perfiles de riesgo, para ayudar a los voluntarios'
      },
      name: {
        label: 'Tu nombre',
        placeholder: 'Escribe tu nombre aquí',
        hint: 'Solo lo usaremos para dirigirnos a ti.'
      },
      phone: {
        label: 'Tu teléfono',
        placeholder: 'Escribe tu teléfono aquí',
        hint: 'Lo usaremos para ponernos en contacto contigo, y para ponerte en contacto con los voluntarios - ellos nunca verán tu número si tú no quieres.'
      },
      address: {
        title: 'Tu dirección',
        description: 'Tu dirección nos ayuda a poder vincularte con voluntarios a tu alrededor'
      }
    }
  },
  unknown: {
    message: 'No sabemos lo que quieres hacer. Por favor, vuelve atrás e inténtalo de nuevo.'
  },
  volunteer: {
    title: 'Registro como voluntario',
    description: 'Los voluntarios sois la pieza vital de esta aplicación, y sin vosotros, nada funcionaría. Muchas gracias por ofrecer tu tiempo para esta labor social.',
    form: {
      name: {
        label: 'Tu nombre',
        placeholder: 'Escribe tu nombre aquí',
        hint: 'Solo lo usaremos para dirigirnos a ti.'
      },
      phone: {
        label: 'Tu teléfono',
        placeholder: 'Escribe tu teléfono aquí',
        hint: 'Lo usaremos para ponernos en contacto contigo, y para ponerte en contacto con los voluntarios - ellos nunca verán tu número si tú no quieres.'
      },
      address: {
        title: 'Tu dirección',
        description: 'Tu dirección nos ayuda a poder vincularte con la gente que necesita ayuda a tu alrededor'
      },
      acknowledgments: {
        title: 'Por favor, se responsable',
        description: 'Confirma que no perteneces a ningún perfil de riesgo, ni tienes a nadie a tu alrededor que pueda pertenecer. El principal objetivo es mantener a todos a salvo.'
      }
    }
  },
  patient: {
    title: 'Registro como paciente',
    description: 'Las personas que no os veáis afectadas por una condición médica urgente, no deberéis acudir a un centro sanitario. Regístrate como paciente y te pondremos en contacto con médicos disponibles, para que podáis hablar a distancia de vuestra condición.',
    form: {
      name: {
        label: 'Tu nombre',
        placeholder: 'Escribe tu nombre aquí',
        hint: 'Solo lo usaremos para dirigirnos a ti.'
      },
      phone: {
        label: 'Tu teléfono',
        placeholder: 'Escribe tu teléfono aquí',
        hint: 'Lo usaremos para ponernos en contacto contigo, y para conectarte con un especialista acorde a tu condición.'
      },
      condition: {
        label: 'Condición médica',
        placeholder: 'Describe tu condición médica',
        hint: 'Describe lo que te pasa. Intenta especificar todo lo que puedas. Si te pasan varias cosas, resúmelas todas aquí'
      },
      specialist: {
        label: 'Especialista',
        placeholder: 'Crees que necesitas un especialista concreto?',
        hint: 'Introduce la especialidad que crees que más se ajusta a lo que te pasa. Si no lo sabes, no pasa nada. Intentaremos determinarlo por ti.'
      }
    }
  },
  doctor: {
    title: 'Registro como especialista sanitario',
    description: 'Los especialistas sanitarios que, por cualquier motivo, no podáis estar trabajando presencialmente, podéis registraros aquí y ofrecer ayuda a distancia a pacientes de vuestra especialidad.',
    form: {
      name: {
        label: 'Tu nombre',
        placeholder: 'Escribe tu nombre aquí',
        hint: 'Solo lo usaremos para dirigirnos a ti.'
      },
      phone: {
        label: 'Tu teléfono',
        placeholder: 'Escribe tu teléfono aquí',
        hint: 'Lo usaremos para ponernos en contacto contigo, y para conectarte con pacientes con condiciones relativas a tu especialidad.'
      },
      speciality: {
        label: 'Especialidad',
        placeholder: 'Cuál es tu especialidad?',
        hint: 'Introduce tu especialidad médica. Si no tienes ninguna, escribe "Ninguna".'
      },
      barId: {
        label: 'Número de colegiado',
        placeholder: 'Cuál es tu número de colegiado?',
        hint: 'Introduce tu número de colegiado del colegio de médicos. Si no estás colegiado, rellena este campo con la justificación de tu capacidad para ofrecer ayuda médica. Un médico lo revisará y te dirá algo.'
      }
    }
  }
}