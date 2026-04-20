import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/client';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated fetching stats if no separate endpoint yet
    // In a real scenario, there's likely a /users/me/stats or we just use user object
    setStats({
      totalHabitsCompleted: user.xp / 100, // naive placeholder
      highestStreak: user.streak || 0,
      joinDate: new Date().toLocaleDateString(),
    });
  }, [user]);

  if (!user || !stats) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pt-12">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Profile Info Card */}
      <div className="card relative overflow-hidden bg-dark-800/80 border-violet-500/30 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
          <div className="flex-shrink-0 relative">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)] text-7xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               {user.avatar || '👤'}
            </div>
            <div className="absolute -bottom-5 -right-5">
               <div className="level-badge w-20 h-20 text-3xl shadow-xl border-4 border-dark-800 flex items-center justify-center">
                 {user.level}
               </div>
            </div>
          </div>
          <div className="flex-1 mt-4 md:mt-0">
             <h1 className="text-4xl font-display font-bold text-white mb-2">{user.username}</h1>
             <p className="text-xl text-gold-400 font-medium mb-6 font-display">{user.title || 'Iniciado'}</p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-dark-900/60 rounded-xl p-4 border border-dark-600 shadow-inner">
                  <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-bold">Nivel</div>
                  <div className="text-2xl font-bold text-white">{user.level}</div>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-4 border border-dark-600 shadow-inner">
                  <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-bold">XP Total</div>
                  <div className="text-2xl font-bold text-violet-400">{user.xp}</div>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-4 border border-dark-600 shadow-inner">
                  <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-bold">Racha Actual</div>
                  <div className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                    🔥 {user.streak}
                  </div>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-4 border border-dark-600 shadow-inner">
                  <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-bold">Racha Max</div>
                  <div className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                    🔥 {stats.highestStreak}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats and Achievements section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📊</span> Estadísticas
          </h2>
          <div className="card space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-dark-600">
               <span className="text-gray-400">Hábitos Completados</span>
               <span className="text-white font-bold text-lg">{Math.floor(stats.totalHabitsCompleted)}</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-dark-600">
               <span className="text-gray-400">Jefe Derrotados</span>
               <span className="text-white font-bold text-lg">0</span> {/* Placeholder */}
             </div>
             <div className="flex justify-between items-center py-3">
               <span className="text-gray-400">Fecha de Ingreso</span>
               <span className="text-white font-medium">{stats.joinDate}</span>
             </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🏆</span> Logros
          </h2>
          <div className="card text-center py-12">
            <div className="text-5xl mb-4 opacity-50 grayscale">🏅</div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Sala de Trofeos Vacía</h3>
            <p className="text-gray-500">Sigue completando misiones para desbloquear logros épicos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
