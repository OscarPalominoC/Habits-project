import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: ''
      });
      
      setStats({
        totalHabitsCompleted: user.xp / 100,
        highestStreak: user.streak || 0,
        joinDate: new Date(user.created_at).toLocaleDateString(),
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };
      
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await api.put('/users/me', updateData);
      await refreshUser();
      setSuccess('¡Perfil actualizado con éxito, guerrero!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !stats) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pt-12">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Success/Error Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-4 rounded-xl text-center font-medium shadow-glow-sm"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

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
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-display font-bold text-white mb-2">{user.username}</h1>
                  <p className="text-xl text-gold-400 font-medium font-display">{user.title || 'Iniciado'}</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary text-sm py-2 px-6"
                  >
                    ⚙️ Editar Perfil
                  </button>
                )}
             </div>

             <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form 
                  key="edit-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleUpdate}
                  className="space-y-4 bg-dark-900/40 p-6 rounded-2xl border border-dark-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-xs">Nombre de Guerrero</label>
                      <input 
                        type="text" 
                        className="input text-sm" 
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Email Mágico</label>
                      <input 
                        type="email" 
                        className="input text-sm" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="label text-xs">Nueva Contraseña (deja en blanco para mantener)</label>
                       <input 
                         type="password" 
                         className="input text-sm" 
                         placeholder="••••••••"
                         value={formData.password}
                         onChange={e => setFormData({...formData, password: e.target.value})}
                       />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary flex-1 py-2 shadow-glow"
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary flex-1 py-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="stats-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
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
                </motion.div>
              )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Static Stats section */}
      {!isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
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
                 <span className="text-white font-bold text-lg">0</span>
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
        </motion.div>
      )}
    </div>
  );
}

