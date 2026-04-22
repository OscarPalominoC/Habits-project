import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
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
    <div className="min-h-screen bg-rpg-gradient text-gray-200 overflow-hidden relative">
      {/* Decorative blurred Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Navbar Minimal */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-xl shadow-glow">
             ⚔️
          </div>
          <span className="text-xl font-display font-bold text-white tracking-wide">Habit<span className="text-gold-400">Quest</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/about" className="hidden md:block text-sm font-medium text-gray-400 hover:text-gold-400 transition-colors">Guía</Link>
          <div className="flex gap-4">
          {token ? (
            <Link to="/dashboard" className="btn-gold">Entrar al Gremio</Link>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 font-medium text-gray-300 hover:text-white transition-colors">Iniciar sesión</Link>
              <Link to="/register" className="btn-gold hidden sm:block">Crear Personaje</Link>
            </>
          )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium tracking-wide">
            🏆 Sube de nivel en la vida real
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
            Forja Tu Destino,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
              Un Hábito A La Vez
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Convierte tus rutinas diarias en una aventura épica. Gana experiencia, sube de nivel, completa misiones y derrota a los malos hábitos para convertirte en la mejor versión de ti mismo.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate(token ? '/dashboard' : '/register')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-dark-900 font-bold text-lg hover:from-gold-400 hover:to-amber-500 transition-all shadow-gold transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              Comenzar Aventura
            </button>
            {!token && (
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-xl border border-gray-600 bg-dark-800/50 text-white font-medium text-lg hover:bg-dark-700 transition-all backdrop-blur-sm w-full sm:w-auto"
              >
                Tengo una cuenta
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {[
            { icon: "📈", title: "Progresión RPG", desc: "Obtén XP con cada buen hábito y mira tu nivel subir." },
            { icon: "⚔️", title: "Completa Misiones", desc: "Tus hábitos son tus misiones. Completa tu lista diaria para reinar." },
            { icon: "🛡️", title: "Forja Disciplina", desc: "Monitorea tu consistencia y mantén tus rachas intactas." }
          ].map((feature, i) => (
            <div key={i} className="card border border-dark-600 bg-dark-800/40 backdrop-blur-md hover:border-gold-500/30 transition-colors p-8 text-left">
              <div className="w-14 h-14 rounded-2xl bg-dark-700 flex items-center justify-center text-2xl mb-6 shadow-inner border border-dark-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
