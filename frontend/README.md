# Habits RPG — Frontend 🎨

La interfaz de **Habits RPG** ha sido diseñada para ofrecer una experiencia visualmente impactante y emocionalmente gratificante, emulando la sensación de progreso de un héroe de videojuego.

## 🚀 Tecnologías

- **React + Vite**: Para una experiencia de desarrollo ultrarrápida y una SPA fluida.
- **Tailwind CSS**: Estilizado moderno con una paleta de colores curada (Dark Mode por defecto).
- **Framer Motion**: El motor detrás de todas las transiciones, pop-ups de XP y animaciones de "Level Up".
- **Zustand**: Gestión de estado global ligera para autenticación y notificaciones.
- **Lucide React & Emojis**: Iconografía temática para reforzar la inmersión.

## 🎭 Estética y Diseño (RPG Core)

Nos alejamos de las listas de tareas aburridas. El frontend utiliza:
- **Glassmorphism**: Paneles con efectos de desenfocado y transparencias sobre fondos oscuros.
- **Gradientes de Poder**: Colores neón y violetas que resaltan los elementos de mayor importancia.
- **Feedback Visual Inmediato**: 
  - Al completar una tarea, una explosión de XP (`+20 XP`) aparece en pantalla.
  - Al subir de nivel, se despliega un anuncio cinemático de corona dorada que celebra tu hazaña.

## 🧭 Estructura de Navegación

1. **Dashboard (`/dashboard`)**: Tu centro de comando. Aquí ves tu "Health & Stats", tu racha de fuego y los hábitos del día.
2. **Misiones (`/habits`)**: El tablón de anuncios donde puedes "forjar" nuevos hábitos y gestionar tus subtareas.
3. **Detalle de Misión (`/habits/:id`)**: Una interfaz de checklist interactiva para registrar tu progreso diario.
4. **Perfil (`/profile`)**: Tu hoja de personaje con estadísticas acumuladas y sala de trofeos.
5. **Landing Page (`/`)**: Una introducción dinámica que explica el sistema a los nuevos reclutas.

## 🖌️ Personalización del Avatar

El sistema incluye un **Selector de Identidad** dinámico accesible desde el Dashboard. Puedes elegir entre diversas clases como Mago, Guerrero, Ninja o incluso Monstruos, y ver cómo tu avatar se sincroniza en toda la barra lateral y perfiles de manera instantánea.

## 🛠️ Ejecución

Para iniciar el laboratorio de diseño:
```bash
npm run dev
```

La aplicación es totalmente responsive, adaptándose desde monitores de escritorio hasta dispositivos móviles para que nunca pierdas el ritmo de tu racha.
