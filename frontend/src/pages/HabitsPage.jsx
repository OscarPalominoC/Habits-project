import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import useUiStore from '../store/uiStore';

export default function HabitsPage() {
  const navigate = useNavigate();
  const addNotification = useUiStore(s => s.addNotification);
  
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'daily',
    xp_reward: 100,
    color: '#8b5cf6'
  });
  
  const [activities, setActivities] = useState([]);

  const fetchHabits = async () => {
    try {
      const { data } = await api.get('/habits');
      setHabits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sumXp = activities.reduce((acc, curr) => acc + (parseInt(curr.xp_value) || 0), 0);
      if (sumXp > 100) {
        addNotification("El límite por misión es de 100 XP máximo en las actividades.", 0);
        return;
      }
      
      const { data: newHabit } = await api.post('/habits', formData);
      
      for (let act of activities) {
        if (act.name.trim() !== '') {
          await api.post('/activities', {
             habit_id: newHabit.id,
             name: act.name,
             xp_value: parseInt(act.xp_value) || 10,
             is_required: true,
             order: act.order
          });
        }
      }
      
      setIsCreating(false);
      setFormData({ name: '', description: '', type: 'daily', xp_reward: 100, color: '#8b5cf6' });
      setActivities([]);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (e, id) => {
    e.stopPropagation(); // Prevents click from opening the habit
    if (!window.confirm('¿Seguro que quieres eliminar esta misión?')) return;
    try {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const addActivityField = () => {
    setActivities([...activities, { name: '', xp_value: 10, order: activities.length + 1 }]);
  };

  const updateActivity = (index, field, value) => {
    const newActs = [...activities];
    newActs[index][field] = value;
    setActivities(newActs);
  };

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Misiones</h1>
          <p className="text-gray-400">Gestiona tus hábitos y tareas diarias para ganar XP.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2 shadow-glow"
        >
          <span>➕</span> Nueva Misión
        </button>
      </div>

      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card border-violet-500/50 bg-dark-800/90 shadow-violet"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Forjar Nueva Misión</h2>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre de la Misión</label>
                <input 
                  type="text" required className="input" placeholder="Ej. Meditar 10 minutos"
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
                   <label className="block text-sm font-medium text-gray-300">Actividades dentro de la Misión</label>
                   <span className="text-xs text-gray-500">Max sumatoria: 100 XP</span>
                 </div>
                 
                 {activities.map((act, index) => (
                   <div key={index} className="flex gap-2 mb-2">
                     <input 
                       type="text" placeholder="Nombre de actividad..." className="input flex-1 py-1 px-3 text-sm"
                       value={act.name} onChange={e => updateActivity(index, 'name', e.target.value)}
                       required
                     />
                     <div className="relative">
                       <input 
                         type="number" className="input w-24 py-1 px-3 pl-8 text-sm" min="1" max="100"
                         value={act.xp_value} onChange={e => updateActivity(index, 'xp_value', e.target.value)}
                       />
                       <span className="absolute left-2 text-gold-400 top-1/2 -translate-y-1/2 text-xs">✨</span>
                     </div>
                     <button type="button" onClick={() => removeActivity(index)} className="text-red-400 hover:text-red-300 p-2">✕</button>
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
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="btn-primary">Forjar Misión</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="card h-32 skeleton mt-4"></div>)}
        </div>
      ) : habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={habit.id}
              onClick={() => navigate(`/habits/${habit.id}`)}
              className="card group cursor-pointer relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:border-violet-500/50 border-dark-600"
              style={{ '--habit-color': habit.color }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-[40px] transition-opacity group-hover:opacity-30" style={{ backgroundColor: habit.color }} />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color, border: `1px solid ${habit.color}40` }}
                >
                  {habit.type === 'daily' ? '☀️' : habit.type === 'weekly' ? '📅' : '✨'}
                </div>
                <button 
                  onClick={(e) => deleteHabit(e, habit.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2"
                  title="Abandonar misión"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{habit.name}</h3>
                {habit.description && <p className="text-gray-400 text-sm mb-4 line-clamp-2">{habit.description}</p>}
                
                <div className="flex items-center justify-between mt-4 text-sm font-medium bg-dark-900/50 p-3 rounded-lg border border-dark-600">
                  <span className="text-gray-300">
                    {habit.type === 'daily' ? 'Misión Diaria' : habit.type === 'weekly' ? 'Misión Semanal' : 'Misión Libre'}
                  </span>
                  <span className="text-gold-400 flex items-center gap-1">
                    <span>✨</span> max {habit.xp_reward} XP
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16 border-dashed border-dark-500 bg-dark-800/30">
          <div className="text-6xl mb-6 opacity-30">📜</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-3">No hay misiones</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">El tablero de misiones está vacío. Forja un nuevo hábito y comienza tu aventura para subir de nivel.</p>
          <button onClick={() => setIsCreating(true)} className="btn-primary inline-flex items-center gap-2">
            <span>➕</span> Forjar Misión
          </button>
        </div>
      )}
    </div>
  );
}
