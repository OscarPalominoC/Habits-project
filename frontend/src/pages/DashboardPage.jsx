import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../api/client";
import XPBar from "../components/XPBar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const refreshUser = useAuthStore(s => s.refreshUser);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const avatars = ["👤", "🧙‍♂️", "🥷", "🗡️", "🏹", "🛡️", "🐉", "🧛‍♂️", "🧛‍♀️", "🧟", "🧚", "🧜‍♂️", "👽", "🤖", "👑"];

  const updateAvatar = async (newAvatar) => {
     try {
       await api.put('/users/me', { avatar: newAvatar });
       setShowAvatarModal(false);
       refreshUser();
     } catch (err) {
       console.error("Error updating avatar", err);
     }
  };

  useEffect(() => {
    const fetchTodayHabits = async () => {
      try {
        const { data } = await api.get("/habits");
        // Simple logic for dashboard: just show all habits for now or filter "daily" ones
        setHabits(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayHabits();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Player Header Banner */}
      <div className="card relative overflow-hidden p-8 border-violet-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-gold-400 blur-xl opacity-30 group-hover:opacity-60 transition-opacity rounded-full"></div>
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="w-32 h-32 rounded-full border-4 border-dark-600 shadow-xl overflow-hidden bg-dark-700 flex items-center justify-center relative cursor-pointer hover:border-violet-500 transition-colors"
            >
              <span className="text-6xl">{user.avatar || '👤'}</span>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-sm font-bold tracking-widest text-white uppercase">
                Cambiar
              </div>
            </button>
            <div className="absolute -bottom-4 -right-2 level-badge w-16 h-16 text-2xl border-4 border-dark-800" title="Nivel Actual">
              {user.level}
            </div>
            <div className="absolute -top-2 -left-2 bg-dark-800 border-2 border-orange-500/50 text-orange-400 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-display shadow-[0_0_15px_rgba(249,115,22,0.4)]" title="Racha Actual">
              {user.streak}🔥
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-white mb-1">{user.username}</h1>
            <p className="text-gold-400 font-medium mb-4 text-lg">{user.title}</p>
            
            <div className="max-w-md w-full mx-auto md:mx-0">
               <XPBar xp={user.xp} xpForNextLevel={user.xp_for_next_level} />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-center">
            <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-600 shadow-inner">
              <p className="text-gray-400 text-sm mb-1">Racha</p>
              <p className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-2">
                🔥 {user.streak}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <span>📜</span> Misiones del Día
        </h2>
        <Link to="/habits" className="text-sm text-violet-400 hover:text-violet-300 font-medium">
          Ver todas →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-24 skeleton"></div>)}
        </div>
      ) : habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={habit.id}
            >
              <Link to={`/habits/${habit.id}`} className="card-hover flex items-center gap-4 group cursor-pointer block h-full">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color, border: `1px solid ${habit.color}40` }}
                >
                  {habit.type === 'daily' ? '☀️' : habit.type === 'weekly' ? '📅' : '✨'}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{habit.name}</h3>
                  <p className="text-sm text-gray-400">+{habit.xp_reward} XP</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-violet-400">
                  →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12 border-dashed border-dark-500">
          <div className="text-5xl mb-4 opacity-50">😴</div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No hay misiones activas</h3>
          <p className="text-gray-500 mb-6">Parece que es hora de crear tu primera misión.</p>
          <Link to="/habits" className="btn-primary inline-flex items-center gap-2">
            <span>⚔️</span> Forjar Misión
          </Link>
        </div>
      )}

      {/* AVATAR MODAL */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card bg-dark-800 border-dark-600 max-w-lg w-full p-6 relative"
            >
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">Elige tu Identidad</h2>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {avatars.map((av, i) => (
                  <button 
                    key={i}
                    onClick={() => updateAvatar(av)}
                    className={`text-4xl p-4 rounded-xl border-2 transition-all hover:scale-110 ${user.avatar === av ? 'border-violet-500 bg-violet-600/20' : 'border-dark-600 bg-dark-700/50 hover:border-gray-400'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
