import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const navItems = [
  { to: "/dashboard", icon: "⚡", label: "Dashboard" },
  { to: "/habits", icon: "📋", label: "Misiones" },
  { to: "/profile", icon: "👤", label: "Perfil" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-800 border-r border-dark-600 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-violet text-xl">
            ⚔️
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">Habits RPG</p>
            <p className="text-xs text-gray-500">Like Solo Leveling</p>
          </div>
        </div>
      </div>

      {/* User mini profile */}
      {user && (
        <div className="px-4 py-4 border-b border-dark-600">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700 relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-2xl bg-dark-800 border border-dark-600 shadow-inner">
              {user.avatar || '👤'}
            </div>
            <div className="absolute -top-2 -left-2 level-badge w-8 h-8 text-xs border-2 border-dark-900" title="Nivel">
              {user.level}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-dark-900 text-orange-400 border border-orange-500/50 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display shadow-[0_0_10px_rgba(249,115,22,0.3)]" title="Días en Racha">
              {user.streak}🔥
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.username}</p>
              <p className="text-gold-400 text-xs truncate">{user.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-gray-400 hover:text-white hover:bg-dark-700"
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          <span className="text-lg">🚪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
