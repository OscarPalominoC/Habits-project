DEFAULT_HABITS = [
  {
    "name": "Despertar del sistema",
    "description": "Comienza tu camino completando tus primeras acciones del día.",
    "type": "daily",
    "xp_reward": 100,
    "activities": [
      {
        "name": "Tender la cama",
        "xp_value": 20,
        "is_required": True,
        "order": 1
      },
      {
        "name": "Lavarte la cara o bañarte",
        "xp_value": 20,
        "is_required": True,
        "order": 2
      },
      {
        "name": "Beber un vaso de agua",
        "xp_value": 10,
        "is_required": True,
        "order": 3
      }
    ]
  },
  {
    "name": "Activación física",
    "description": "Activa tu cuerpo para mejorar tu energía y enfoque.",
    "type": "daily",
    "xp_reward": 100,
    "activities": [
      {
        "name": "Calentamiento (5 minutos)",
        "xp_value": 20,
        "is_required": True,
        "order": 1
      },
      {
        "name": "Ejercicio principal (flexiones, cardio, etc.)",
        "xp_value": 50,
        "is_required": True,
        "order": 2
      },
      {
        "name": "Estiramiento",
        "xp_value": 30,
        "is_required": False,
        "order": 3
      }
    ]
  },
  {
    "name": "Mente enfocada",
    "description": "Entrena tu mente para mantener disciplina y claridad.",
    "type": "daily",
    "xp_reward": 100,
    "activities": [
      {
        "name": "Leer 10-20 minutos",
        "xp_value": 40,
        "is_required": True,
        "order": 1
      },
      {
        "name": "Evitar distracciones por 30 minutos",
        "xp_value": 40,
        "is_required": True,
        "order": 2
      },
      {
        "name": "Anotar una idea o aprendizaje",
        "xp_value": 20,
        "is_required": False,
        "order": 3
      }
    ]
  },
  {
    "name": "Control del día",
    "description": "Toma control de tu tiempo y tus responsabilidades.",
    "type": "daily",
    "xp_reward": 100,
    "activities": [
      {
        "name": "Planificar el día (3 tareas clave)",
        "xp_value": 40,
        "is_required": True,
        "order": 1
      },
      {
        "name": "Completar al menos 1 tarea importante",
        "xp_value": 40,
        "is_required": True,
        "order": 2
      },
      {
        "name": "Revisar pendientes",
        "xp_value": 20,
        "is_required": False,
        "order": 3
      }
    ]
  },
  {
    "name": "Cierre del día",
    "description": "Reflexiona y cierra tu día con intención.",
    "type": "daily",
    "xp_reward": 100,
    "activities": [
      {
        "name": "Reflexionar sobre el día",
        "xp_value": 40,
        "is_required": True,
        "order": 1
      },
      {
        "name": "Preparar el día siguiente",
        "xp_value": 40,
        "is_required": True,
        "order": 2
      },
      {
        "name": "Evitar pantallas antes de dormir (30 min)",
        "xp_value": 20,
        "is_required": False,
        "order": 3
      }
    ]
  }
]
