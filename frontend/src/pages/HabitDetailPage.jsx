import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import useUiStore from '../store/uiStore';
import useAuthStore from '../store/authStore';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [habit, setHabit] = useState(null);
  const [activities, setActivities] = useState([]);
  const [progressHistory, setProgressHistory] = useState([]);
  const [checkedActs, setCheckedActs] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Animation state
  const [showXpAnim, setShowXpAnim] = useState(0);
  const [showLevelUpAnim, setShowLevelUpAnim] = useState(0);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editActivities, setEditActivities] = useState([]);

  const addNotification = useUiStore(s => s.addNotification);
  const refreshUser = useAuthStore(s => s.refreshUser);

  const fetchHabitAndData = async () => {
    try {
      const [habitRes, actRes, progRes] = await Promise.all([
        api.get(`/habits/${id}`),
        api.get(`/activities/habit/${id}`),
        api.get(`/progress?habit_id=${id}`)
      ]);
      setHabit(habitRes.data);
      setActivities(actRes.data);
      setProgressHistory(progRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitAndData();
  }, [id]);

  const toggleCheck = (actId) => {
    setCheckedActs(prev => ({...prev, [actId]: !prev[actId]}));
  };

  const completeHabit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const activitiesPayload = activities.map(act => ({
        activity_id: act.id,
        completed: !!checkedActs[act.id]
      }));
      
      const anyChecked = activitiesPayload.some(a => a.completed);
      if (!anyChecked) {
         addNotification("Selecciona al menos una actividad completada.", 0);
         return;
      }

      const { data } = await api.post('/progress', {
        habit_id: id,
        date: today,
        activities: activitiesPayload
      });

      refreshUser();
      
      const progRes = await api.get(`/progress?habit_id=${id}`);
      setProgressHistory(progRes.data);
      
      // Trigger conditional animations
      if (data.leveled_up) {
         setShowLevelUpAnim(data.new_level);
         setTimeout(() => {
            setShowLevelUpAnim(0);
            navigate('/dashboard');
         }, 4000);
      } else {
         setShowXpAnim(data.xp_gained);
         setTimeout(() => {
            setShowXpAnim(0);
            navigate('/dashboard');
         }, 2000);
      }
      
    } catch (err) {
      console.error(err);
      addNotification("Error al guardar progreso.", 0);
    }
  };

  // --- EDIT LOGIC --- //
  const startEditing = () => {
    setFormData({
      name: habit.name,
      description: habit.description,
      type: habit.type,
      xp_reward: habit.xp_reward,
      color: habit.color
    });
    // Deep clone activities
    setEditActivities(activities.map(a => ({...a})));
    setIsEditing(true);
  };

  const addActivityField = () => {
    setEditActivities([...editActivities, { name: '', xp_value: 10, order: editActivities.length + 1 }]);
  };

  const updateEditActivity = (index, field, value) => {
    const newActs = [...editActivities];
    newActs[index][field] = value;
    setEditActivities(newActs);
  };

  const removeEditActivity = (index) => {
    setEditActivities(editActivities.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate XP limit 
      const sumXp = editActivities.reduce((acc, curr) => acc + (parseInt(curr.xp_value) || 0), 0);
      if (sumXp > 100) {
         addNotification("El límite por misión es de 100 XP máximo en las actividades.", 0);
         return;
      }

      // Update Habit
      await api.put(`/habits/${id}`, formData);

      // Handle Activities (Create, Update, Delete)
      const currentIds = editActivities.filter(a => a.id).map(a => a.id);
      
      // 1. Delete removed activities
      const actsToDelete = activities.filter(a => !currentIds.includes(a.id));
      for (const act of actsToDelete) {
        await api.delete(`/activities/${act.id}`);
      }

      // 2. Update existing & Create new
      for (const act of editActivities) {
        if (!act.name.trim()) continue;
        
        if (act.id) {
          await api.put(`/activities/${act.id}`, {
            name: act.name,
            xp_value: parseInt(act.xp_value),
            is_required: true,
            order: act.order
          });
        } else {
          await api.post('/activities', {
             habit_id: id,
             name: act.name,
             xp_value: parseInt(act.xp_value),
             is_required: true,
             order: act.order
          });
        }
      }

      setIsEditing(false);
      addNotification("Misión actualizada con éxito.", 0);
      fetchHabitAndData();
    } catch (err) {
      console.error(err);
      addNotification("Hubo un error al actualizar la misión.", 0);
    }
  };

  const deleteHabit = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta misión por completo? Se perderá el historial.")) return;
    try {
      await api.delete(`/habits/${id}`);
      addNotification("Misión eliminada", 0);
      navigate("/habits");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="w-16 h-16 mx-auto border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!habit) return <div className="text-center text-red-400 mt-12 bg-dark-800 p-8 rounded-xl max-w-lg mx-auto">Misión no encontrada.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      <Link to="/habits" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors">
        <span>←</span> Volver a Misiones
      </Link>

      {/* SUCCESS ANIMATION OVERLAYS */}
      <AnimatePresence>
        {showXpAnim > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -50 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="text-center">
              <span className="text-8xl block mb-4">🌟</span>
              <h2 className="text-6xl font-display font-bold text-gold-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">
                +{showXpAnim} XP
              </h2>
              <p className="text-2xl text-white mt-4 font-bold tracking-widest uppercase">¡Progreso Registrado!</p>
            </div>
          </motion.div>
        )}

        {showLevelUpAnim > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.2, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-violet-900/80 backdrop-blur-md"
          >
            <div className="text-center">
              <span className="text-9xl block mb-6 animate-pulse">👑</span>
              <h2 className="text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-yellow-200 to-amber-500 drop-shadow-[0_0_30px_rgba(250,204,21,1)]">
                ¡NIVEL {showLevelUpAnim}!
              </h2>
              <p className="text-3xl text-white mt-6 font-bold tracking-widest uppercase animate-bounce">¡Has subido de nivel!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card relative overflow-hidden bg-dark-800 border-dark-600 border-l-4" style={{ minHeight: '200px', borderLeftColor: habit.color }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-[80px]" style={{ backgroundColor: habit.color }} />
        
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-xl flex-shrink-0"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color, border: `1px solid ${habit.color}40` }}
          >
            {habit.type === 'daily' ? '☀️' : habit.type === 'weekly' ? '📅' : '✨'}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-display font-bold text-white">{habit.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-dark-900/80 border border-dark-600" style={{ color: habit.color }}>
                  {habit.type}
                </span>
              </div>
              
              {/* EDIT BUTTONS */}
              <div className="flex gap-2">
                <button 
                  onClick={startEditing}
                  className="px-3 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors flex items-center gap-2 border border-dark-500"
                >
                  ⚙️ Editar
                </button>
                <button 
                  onClick={deleteHabit}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 text-lg max-w-2xl">{habit.description || "Sin descripción detallada."}</p>
            
            <div className="flex items-center gap-4">
              <div className="bg-dark-900/80 rounded-xl px-4 py-2 border border-dark-600 flex items-center gap-2">
                 <span className="text-gold-400">✨</span>
                 <span className="font-bold text-white">Recompensa Máx: {habit.xp_reward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card border-violet-500/50 bg-dark-800/90 shadow-violet"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">⚙️ Configurar Misión</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre de la Misión</label>
                <input 
                  type="text" required className="input" placeholder="Ej. Meditar"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Recompensa Máxima (XP)</label>
                <input 
                  type="number" required className="input" min="10" max="100"
                  value={formData.xp_reward} onChange={e => setFormData({...formData, xp_reward: parseInt(e.target.value)})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Descripción (Opcional)</label>
                <input 
                  type="text" className="input" placeholder="Detalles de tu misión"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Frecuencia</label>
                <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="custom">Personalizada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Color del Emblema</label>
                <div className="flex gap-2">
                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(c => (
                    <button
                      key={c} type="button"
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${formData.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setFormData({...formData, color: c})}
                    />
                  ))}
                </div>
              </div>
              
              {/* Dynamic Activities Section */}
              <div className="md:col-span-2 p-4 bg-dark-900 rounded-xl border border-dark-600 mt-2">
                 <div className="flex items-center justify-between mb-3">
                   <label className="block text-sm font-medium text-gray-300">Actividades (Max: 100 XP)</label>
                   <span className="text-xs text-gray-500 font-bold">
                     Suma Actual: {editActivities.reduce((acc, curr) => acc + (parseInt(curr.xp_value) || 0), 0)} XP
                   </span>
                 </div>
                 
                 {editActivities.map((act, index) => (
                   <div key={index} className="flex gap-2 mb-2">
                     <input 
                       type="text" placeholder="Nombre de actividad..." className="input flex-1 py-1 px-3 text-sm"
                       value={act.name} onChange={e => updateEditActivity(index, 'name', e.target.value)}
                       required
                     />
                     <div className="relative">
                       <input 
                         type="number" className="input w-24 py-1 px-3 pl-8 text-sm" min="1" max="100"
                         value={act.xp_value} onChange={e => updateEditActivity(index, 'xp_value', e.target.value)}
                       />
                       <span className="absolute left-2 text-gold-400 top-1/2 -translate-y-1/2 text-xs">✨</span>
                     </div>
                     <button type="button" onClick={() => removeEditActivity(index)} className="text-red-400 hover:text-red-300 p-2">✕</button>
                   </div>
                 ))}
                 
                 <button 
                   type="button" 
                   onClick={addActivityField} 
                   className="mt-2 text-violet-400 text-sm font-medium hover:text-violet-300 flex items-center gap-1"
                 >
                   <span>➕</span> Añadir una subtarea o actividad
                 </button>
              </div>

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Checklist Section */}
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <span>📝</span> Lista de Actividades
          </h2>
          
          {activities.length > 0 ? (
            <div className="space-y-3 mb-6">
              {activities.map((act, i) => (
                <label 
                  key={act.id} 
                  className={`card flex items-center gap-4 p-4 border border-dark-600 bg-dark-800/50 cursor-pointer transition-colors ${checkedActs[act.id] ? 'border-violet-500/50 bg-violet-600/10' : 'hover:bg-dark-700/50'}`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-dark-900 border border-dark-500">
                    <input 
                      type="checkbox" 
                      className="opacity-0 absolute w-0 h-0"
                      checked={!!checkedActs[act.id]} 
                      onChange={() => toggleCheck(act.id)} 
                    />
                    {checkedActs[act.id] && <span className="text-violet-400 text-sm">✓</span>}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium transition-colors ${checkedActs[act.id] ? 'text-gray-300 line-through' : 'text-white'}`}>{act.name}</p>
                  </div>
                  <div className="text-gold-400 font-bold text-sm">
                    +{act.xp_value} XP
                  </div>
                </label>
              ))}
              
              <button 
                onClick={completeHabit}
                className="btn-primary w-full shadow-glow transition-all hover:scale-[1.02] active:scale-95 py-3 mt-4"
                style={{ '--tw-shadow-color': habit.color + '40' }}
              >
                Guardar Progreso Seleccionado
              </button>
            </div>
          ) : (
            <div className="card text-center py-8 border-dashed border-dark-600 text-gray-500">
              No se han definido actividades para esta misión.
            </div>
          )}
        </div>

        {/* History Section */}
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            <span>📚</span> Historial de Progreso
          </h2>
          {progressHistory.length > 0 ? (
            <div className="space-y-3">
              {progressHistory.map((prog, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={prog.id} 
                  className="card flex items-center justify-between p-4 border-dark-600 bg-dark-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${prog.status === 'complete' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                      {prog.status === 'complete' ? '✓' : '•'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{prog.date}</p>
                      <p className="text-xs text-gray-400">Progreso: {Math.round(prog.completion_percentage)}%</p>
                    </div>
                  </div>
                  <div className="font-bold text-gold-400 bg-dark-900 border border-dark-600 px-3 py-1 rounded-lg">
                    +{prog.xp_earned} XP
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 border-dashed border-dark-600 text-gray-500">
              Aún no hay progreso registrado para esta misión.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
