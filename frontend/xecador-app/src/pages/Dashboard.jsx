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

  // Colaboradores visibles según rol
  const misColaboradores = rol === 'Supervisor'
    ? colaboradoresDemo.filter(c => c.area === 'Mesa de Ayuda y Soporte Técnico')
    : colaboradoresDemo;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Bienvenido, {nombre} ·{' '}
            <span className={`font-semibold ${
              rol === 'SuperAdmin' ? 'text-red-500' :
              rol === 'TalentoHumano' ? 'text-blue-500' : 'text-green-600'
            }`}>
              {rol === 'SuperAdmin' ? 'Super Administrador' :
               rol === 'TalentoHumano' ? 'Talento Humano' : 'Supervisor'}
            </span>
          </p>
        </div>

        {/* Stats — SuperAdmin y TH ven todo, Supervisor solo sus números */}
        <div className={`grid gap-4 mb-6 ${rol === 'Supervisor' ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-green-500">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
              {rol === 'Supervisor' ? 'Mi equipo hoy' : 'Presentes hoy'}
            </p>
            <p className="text-3xl font-bold text-green-600">
              {rol === 'Supervisor' ? misColaboradores.filter(c => c.activo).length : presentes}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-yellow-400">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Retardos</p>
            <p className="text-3xl font-bold text-yellow-500">{retardos}</p>
          </div>

          {rol !== 'Supervisor' && (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-red-400">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Ausentes</p>
                <p className="text-3xl font-bold text-red-500">{ausentes}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 border-t-4 border-t-blue-400">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Incidencias pendientes</p>
                <p className="text-3xl font-bold text-blue-500">{pendientes}</p>
              </div>
            </>
          )}
        </div>

        {/* Acciones rápidas según rol */}
        <div className="flex gap-3 mb-6">
          {rol === 'SuperAdmin' && (
            <>
              <button onClick={() => navigate('/empleados')}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                + Añadir colaborador
              </button>
              <button onClick={() => navigate('/empleados')}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
                Gestionar unidades
              </button>
            </>
          )}
          {(rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
            <button onClick={() => navigate('/incidencias')}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Ver incidencias pendientes
            </button>
          )}
          {rol === 'Supervisor' && (
            <button onClick={() => navigate('/incidencias')}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + Registrar incidencia
            </button>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-3 gap-4">

          {/* Mis colaboradores / Incidencias */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">
              {rol === 'Supervisor' ? 'Mis colaboradores' : 'Incidencias pendientes'}
            </h2>

            {rol === 'Supervisor' ? (
              misColaboradores.map(c => (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-700">
                    {c.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                    <p className="text-xs text-gray-400">{c.puesto} · {c.horario}</p>
                  </div>
                  <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                    Activo
                  </span>
                </div>
              ))
            ) : (
              incidenciasDemo.filter(i => i.estatus === 'Pendiente').map(inc => (
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
              ))
            )}
          </div>

          {/* Panel derecho */}
          <div className="flex flex-col gap-4">

            {/* Guardias fin de semana */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Guardias este finde</h2>
              {colaboradoresDemo.filter(c => c.guardia !== 'Ninguna').map(c => (
                <div key={c.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {c.nombre.split(' ').slice(0,2).join(' ')}
                    </p>
                    <p className="text-xs text-gray-400">{c.guardia}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Acceso rápido según rol */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Acceso rápido</h2>
              <div className="space-y-2">
                <div onClick={() => navigate('/asistencia')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span>📅</span>
                  <span className="text-sm text-gray-700">Ver asistencia</span>
                </div>
                <div onClick={() => navigate('/incidencias')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span>🔔</span>
                  <span className="text-sm text-gray-700">Incidencias</span>
                </div>
                {rol !== 'Supervisor' && (
                  <div onClick={() => navigate('/empleados')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <span>👥</span>
                    <span className="text-sm text-gray-700">Empleados</span>
                  </div>
                )}
                <div onClick={() => navigate('/horarios')}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span>⏰</span>
                  <span className="text-sm text-gray-700">Horarios</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;