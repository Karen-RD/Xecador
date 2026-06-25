import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo, incidenciasDemo } from '../services/datosDemo';

function Dashboard() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const nombre = localStorage.getItem('nombre');

  const presentes = 4;
  const retardos = 1;
  const ausentes = 1;
  const pendientes = incidenciasDemo.filter(i => i.estatus === 'Pendiente').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Bienvenida, {nombre} · {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Botón Super Admin */}
        {rol === 'SuperAdmin' && (
          <button
            onClick={() => navigate('/empleados')}
            className="mb-6 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            + Añadir colaborador
          </button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-green-500">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Presentes hoy</p>
            <p className="text-3xl font-bold text-green-600">{presentes}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-yellow-400">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Retardos</p>
            <p className="text-3xl font-bold text-yellow-500">{retardos}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-red-400">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Ausentes</p>
            <p className="text-3xl font-bold text-red-500">{ausentes}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-blue-400">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Incidencias</p>
            <p className="text-3xl font-bold text-blue-500">{pendientes}</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-3 gap-4">
          {/* Incidencias pendientes */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Incidencias pendientes</h2>
            {incidenciasDemo.filter(i => i.estatus === 'Pendiente').map(inc => (
              <div key={inc.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-700">
                  {inc.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{inc.nombre}</p>
                  <p className="text-xs text-gray-400">{inc.tipo} · {inc.fechaInicio}</p>
                </div>
                <span className="text-xs font-semibold bg-yellow-50 text-yellow-600 px-2 py-1 rounded-md">
                  Pendiente
                </span>
              </div>
            ))}
          </div>

          {/* Guardias fin de semana */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Guardias este finde</h2>
            {colaboradoresDemo.filter(c => c.guardia !== 'Ninguna').map(c => (
              <div key={c.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.nombre.split(' ').slice(0,2).join(' ')}</p>
                  <p className="text-xs text-gray-400">{c.guardia}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;