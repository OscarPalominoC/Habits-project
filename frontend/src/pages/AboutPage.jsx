import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-rpg-gradient text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-sm font-medium tracking-wide italic">
             Misión: Documentación de la Plataforma
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Forja tu Camino en <span className="text-gold-400">Habits RPG</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Convertimos tus rutinas en épicas misiones. Descubre cómo nuestra plataforma te ayuda a subir de nivel en la vida real.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Section 1: La Idea */}
          <motion.section variants={fadeIn} className="card border-dark-600 bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-violet border border-violet-500/30">
                ✨
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">La idea detrás de la plataforma</h2>
                <p className="text-gray-400 leading-relaxed">
                  ¿Alguna vez has sentido que los RPG son más gratificantes que la vida real? 
                  Habits RPG nació para cerrar esa brecha. Inspirada en conceptos como "Solo Leveling", 
                  nuestra misión es transformar el aburrido seguimiento de hábitos en una aventura emocionante 
                  donde tú eres el protagonista. Cada tarea completada es una victoria, cada hábito mantenido es un aumento de nivel.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Beneficios */}
          <motion.section variants={fadeIn} className="card border-dark-600 bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gold-600/20 text-gold-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-gold border border-gold-500/30">
                📈
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">¿Cómo te ayuda a mejorar?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-gold-300 font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                      Gratificación Instantánea
                    </h3>
                    <p className="text-sm text-gray-400">Recibe XP al instante. Ver tu barra de progreso subir libera dopamina, reforzando el comportamiento positivo.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gold-300 font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                      Visualización de Avances
                    </h3>
                    <p className="text-sm text-gray-400">Tu nivel y estadísticas reflejan tu disciplina real. Eres un reflejo de tus hábitos diarios.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Funcionalidades */}
          <motion.section variants={fadeIn} className="card border-dark-600 bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                ⚔️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">¿Qué puedes hacer con Habits RPG?</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="text-violet-400">🗹</span> Crea y gestiona misiones diarias.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-violet-400">✦</span> Sube de nivel y desbloquea títulos.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-violet-400">🔥</span> Mantén rachas para bonificadores.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-violet-400">📊</span> Gráficos detallados de consistencia.
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Para Quién */}
          <motion.section variants={fadeIn} className="card border-dark-600 bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/30">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">¿Para quién es esta plataforma?</h2>
                <p className="text-gray-400 leading-relaxed">
                  Para los que encuentran aburridas las apps de productividad tradicionales. 
                  Para gamers que quieren aplicar estrategias de farmeo a su salud y finanzas. 
                  Y para cualquiera que alguna vez deseó que la vida tuviera una barra de progreso.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Qué esperar con el tiempo */}
          <motion.section variants={fadeIn} className="card border-dark-600 bg-dark-800/60 backdrop-blur-md">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-violet border border-violet-500/30">
                ⌛
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">¿Qué puedes esperar con el tiempo?</h2>
                <div className="space-y-4 text-gray-400">
                  <p>
                    A medida que avanzas en tu aventura, notarás que los hábitos que antes requerían un gran esfuerzo se vuelven automáticos. 
                    Tu "jugador" en la plataforma es un reflejo de tu disciplina en la vida real.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Nuevas Alturas:</strong> Títulos más legendarios que demuestran tu compromiso.</li>
                    <li><strong>Consistencia Increíble:</strong> Rachas que se vuelven motivo de orgullo personal.</li>
                    <li><strong>Mejores Resultados:</strong> Una versión más saludable, productiva y organizada de ti mismo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 6: Download App */}
          <motion.section 
            variants={fadeIn} 
            className="p-8 rounded-3xl bg-gradient-to-br from-dark-800 to-indigo-900/40 border border-indigo-500/30 text-center shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-8xl">📱</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-white mb-4">Lleva tu Aventura a Todas Partes</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Descarga la aplicación oficial para Android y nunca pierdas una misión, sin importar dónde estés.
            </p>
            
            <a 
              href="https://s3.us-east-1.amazonaws.com/oscarpalomino.dev/Habits-RPG.apk" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-dark-900 font-bold text-lg hover:bg-gold-400 transition-all shadow-glow transform hover:scale-105 active:scale-95"
            >
              <span>📥</span> Descargar para Android
            </a>
            
            <p className="mt-4 text-xs text-indigo-300 italic opacity-60">
              * Archivo .APK directo. Próximamente en la Play Store.
            </p>
          </motion.section>

          {/* Footer Back Link */}
          <motion.div variants={fadeIn} className="text-center pt-8">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <span>←</span> Volver a la página principal
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
