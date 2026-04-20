# Habits RPG — Backend API 🛡️

Este es el motor de juego de **Habits RPG**, una API RESTful construida con **FastAPI** que gestiona la lógica de progresión, autenticación y gestión de hábitos.

## 🛠️ Stack Tecnológico

- **FastAPI**: Framework web de alto rendimiento.
- **MongoDB**: Base de datos NoSQL para almacenamiento flexible.
- **Beanie**: ODM (Object Document Mapper) asíncrono para MongoDB construido sobre Pydantic.
- **JWT (JSON Web Tokens)**: Autenticación segura y stateless.
- **Pydantic**: Validación de datos y esquemas.

## 🔑 Endpoints de la API

### Autenticación (`/auth`)
- `POST /auth/register`: Registro de nuevos usuarios (incluye creación automática de misiones base).
- `POST /auth/login`: Inicio de sesión y obtención de token JWT.

### Usuarios (`/users`)
- `GET /users/me`: Obtiene el perfil del usuario actual (nivel, xp, racha, avatar).
- `PUT /users/me`: Actualiza datos del perfil (nombre de usuario, avatar).

### Misiones (`/habits`)
- `GET /habits`: Lista todas las misiones del usuario.
- `POST /habits`: Crea una nueva misión maestra.
- `GET /habits/{id}`: Obtiene detalles de una misión específica.
- `PUT /habits/{id}`: Modifica una misión existente.
- `DELETE /habits/{id}`: Elimina una misión y sus actividades asociadas.

### Actividades (`/activities`)
- `GET /activities/habit/{habit_id}`: Obtiene las subtareas de una misión.
- `POST /activities`: Añade una nueva actividad a una misión.
- `PUT /activities/{id}`: Actualiza una actividad.
- `DELETE /activities/{id}`: Elimina una actividad.

### Progreso (`/progress`)
- `POST /progress`: Registra el cumplimiento de actividades para una fecha. Calcula XP y verifica subidas de nivel.
- `GET /progress`: Consulta el historial de progreso (opcionalmente filtrado por misión).

### Logros (`/achievements`)
- `GET /achievements`: Lista los logros desbloqueados por el usuario.

## ⚖️ Sistema de Experiencia (XP)

El backend implementa una fórmula de crecimiento exponencial para los niveles:
- **Nivel 0 a 1**: 100 XP.
- **Cálculo**: La XP requerida se duplica progresivamente hasta un tope de seguridad.
- **Límite**: Cada misión tiene un tope estricto de **100 XP** distribuibles entre sus actividades.

## ⚙️ Configuración

Requiere un archivo `.env` en la raíz de la carpeta `backend` con:
```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=habits_rpg
JWT_SECRET=tu_secreto_super_seguro
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
