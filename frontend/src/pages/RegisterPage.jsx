import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const register = useAuthStore(s => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rpg-gradient p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md relative z-10 border-gold-500/20 backdrop-blur-md bg-dark-800/80"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center shadow-gold text-3xl mx-auto mb-4">
            🛡️
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Crear Jugador</h1>
          <p className="text-gray-400">Forja tu destino con cada nuevo hábito</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre de usuario</label>
            <input 
              type="text" 
              required
              className="input focus:border-gold-500 focus:ring-gold-500/30" 
              placeholder="Jugador1"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              className="input focus:border-gold-500 focus:ring-gold-500/30" 
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Contraseña</label>
            <input 
              type="password" 
              required
              className="input focus:border-gold-500 focus:ring-gold-500/30" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-gold w-full mt-6"
          >
            {loading ? "Creando..." : "Comenzar Aventura"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">Inicia Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
