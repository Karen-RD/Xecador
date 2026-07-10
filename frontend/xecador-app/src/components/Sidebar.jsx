import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rol = localStorage.getItem('rol');
  const nombre = localStorage.getItem('nombre');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { path: '/asistencia', icon: '📅', label: 'Asistencia' },
    { path: '/incidencias', icon: '🔔', label: 'Incidencias' },
    { path: '/empleados', icon: '👥', label: 'Empleados' },
    { path: '/horarios', icon: '⏰', label: 'Horarios', roles: ['SuperAdmin','TalentoHumano','Supervisor'] },
  ];

  return (
    <div className="w-56 bg-green-950 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <span className="text-lg font-bold">
          Xe<span className="text-green-400">cador</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
              isActive(item.path)
                ? 'bg-green-800/60 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-white/10">
        <p className="text-sm font-semibold truncate">{nombre}</p>
        <p className="text-xs text-white/50 mb-2">{rol}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-red-300 hover:text-red-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;