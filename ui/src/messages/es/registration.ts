export default {
  title: 'Bienvenido a LucharAlVirus.com!',
  description: `
    Hemos creado esta página para facilitar los tantos actos voluntarios que se están haciendo para ayudar a las personas con más riesgo a mantenerse a salvo.

    Para intentar ayudaros, ponemos a vuestra disposición esta plataforma, en la que tanto personas en grupos de riesgo como voluntarios podéis registraros, y pedir u ofrecer ayuda en vuestra ciudad. Recopilamos las solicitudes de ayuda de la gente y se las enviamos a los voluntarios que se encuentren cerca. Cuando ellos aceptan, os ponemos en contacto. Esperamos que así podamos juntos proteger a la gente con más riesgo.

    <h3>Accesible a todo el mundo</h3>
    Muchas personas en condiciones de riesgo no tienen acceso a la tecnología. Esto hace que las muchísimas ofertas de ayuda que vemos en las redes sociales no lleguen a todos los destinos, y que haya gente que no reciba la ayuda que necesita. Por esto hemos hecho accesible, con la misma funcionalidad que en la web, <b>un servicio para pedir ayuda por teléfono</b>. Si conoces a alguien que pueda necesitar ayuda, y que no tenga un acceso a internet, dile que puede llamar al número:

    <pre>{phone}</pre>

    Un sistema te preguntará ciertos datos para registrarte y apuntar tu dirección, y te permitirá pedir ayuda. A partir de ahí, todo funcionará de manera normal.
  `,
  disclaimer: 'Para conseguir que esta herramienta funcione de manera correcta, facilitaremos tu número de teléfono a los voluntarios que acepten tus solicitudes de ayuda. Ellos te llamarán para coordinar contigo lo que necesites.',
  donations: {
    title: 'Ayuda a mantener esta iniciativa',
    description: 'Para que esta plataforma funcione para todos, la hemos alojado en la nube. Estamos intentando contactar con nuestros proveedores para que no nos cobren este servicio, pero de no ser así, no podremos mantenerla activa sin tu ayuda. Por favor, dona a esta iniciativa siguiendo este link: {link}. Muchas gracias por tu ayuda! <b>Nota</b> Todo el dinero que nos sobre será donado a quien más lo necesite en estos momentos.'
  },
  loadingText: 'Tu cuenta está lista! Te estamos dirigiendo a la aplicación',
  success: 'Hemos guardado los datos correctamente',
  error: 'Ha habido un error cuando intentábamos guardar los datos.',
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
  affected: {
    title: 'Registro de posibles afectados',
    description: 'Utiliza el formulario de la derecha para registrarte. Una vez hayas confirmado tu cuenta, te facilitaremos un sistema para que puedas reportar tus síntomas períodicamente, para llevar un mejor control de tu evolución. Es posible que un médico te llame para saber cómo te encuentras.',
    form: {
      submit: 'Actualizar mi perfil',
      riskAssessment: {
        label: 'Estás en un grupo de riesgo?',
        placeholder: 'Selecciona las opciones que se adapten a ti',
        hint: 'Estas opciones nos ayudan a evaluar mejor tu perfil.'
      }
    }
  },
  risk: {
    title: 'Registro como grupo de riesgo',
    description: 'Utiliza este formulario para registrarte como miembro de un grupo de riesgo. Intentaremos darte acceso a utilidades y herramientas para facilitar tu aislamiento, y seguiremos tu estado para saber que estás bien.',
    form: {
      submit: 'Guardar',
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
      submit: 'Date de alta como voluntario',
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
      title: 'Reporta una condición médica',
      submit: 'Reportar condición',
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