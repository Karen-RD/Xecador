import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { incidenciasDemo } from '../services/datosDemo';

function Incidencias() {
  const [incidencias, setIncidencias] = useState(incidenciasDemo);
  const [filtro, setFiltro] = useState('Pendiente');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nueva, setNueva] = useState({ nombre: '', tipo: 'Vacaciones', fechaInicio: '', fechaFin: '' });
  const rol = localStorage.getItem('rol');

  const incFiltradas = filtro === 'Todas'
    ? incidencias
    : incidencias.filter(i => i.estatus === filtro);

  const handleAprobar = (id) => {
    setIncidencias(incidencias.map(i => i.id === id ? { ...i, estatus: 'Aprobado' } : i));
  };

  const handleRechazar = (id) => {
    setIncidencias(incidencias.map(i => i.id === id ? { ...i, estatus: 'Rechazado' } : i));
  };

  const handleGuardar = () => {
    if (!nueva.nombre || !nueva.fechaInicio) return;
    setIncidencias([...incidencias, {
      id: incidencias.length + 1,
      colaboradorId: 99,
      ...nueva,
      estatus: 'Pendiente'
    }]);
    setMostrarForm(false);
    setNueva({ nombre: '', tipo: 'Vacaciones', fechaInicio: '', fechaFin: '' });
  };

  const colorEstatus = (e) => {
    if (e === 'Pendiente') return 'bg-yellow-50 text-yellow-600';
    if (e === 'Aprobado') return 'bg-green-50 text-green-700';
    return 'bg-red-50 text-red-500';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Incidencias</h1>
            <p className="text-sm text-gray-500">
              {incidencias.filter(i => i.estatus === 'Pendiente').length} pendientes de aprobación
            </p>
          </div>
          <button onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
            + Nueva incidencia
          </button>
        </div>

        {/* Formulario */}
        {mostrarForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Nueva incidencia</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre del colaborador" value={nueva.nombre}
                onChange={e => setNueva({...nueva, nombre: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 col-span-2" />
              <select value={nueva.tipo} onChange={e => setNueva({...nueva, tipo: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600">
                <option>Vacaciones</option>
                <option>Permiso</option>
                <option>Justificante</option>
                <option>Incapacidad</option>
                <option>Día festivo</option>
              </select>
              <input type="date" value={nueva.fechaInicio}
                onChange={e => setNueva({...nueva, fechaInicio: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              <input type="date" value={nueva.fechaFin}
                onChange={e => setNueva({...nueva, fechaFin: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleGuardar}
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Guardar</button>
              <button onClick={() => setMostrarForm(false)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm">Cancelar</button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          {['Pendiente', 'Aprobado', 'Rechazado', 'Todas'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${filtro === f ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {incFiltradas.map(inc => (
            <div key={inc.id}
              className={`bg-white border-l-4 border border-gray-200 rounded-xl p-4 flex items-center gap-4 ${inc.estatus === 'Pendiente' ? 'border-l-yellow-400' : inc.estatus === 'Aprobado' ? 'border-l-green-500' : 'border-l-red-400'}`}>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                {inc.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{inc.nombre}</p>
                <p className="text-xs text-gray-400">
                  {inc.tipo} · {inc.fechaInicio} {inc.fechaFin && inc.fechaFin !== inc.fechaInicio ? `→ ${inc.fechaFin}` : ''}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colorEstatus(inc.estatus)}`}>
                {inc.estatus}
              </span>
              {inc.estatus === 'Pendiente' && (rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
                <div className="flex gap-2">
                  <button onClick={() => handleAprobar(inc.id)}
                    className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100">
                    ✓ Aprobar
                  </button>
                  <button onClick={() => handleRechazar(inc.id)}
                    className="text-xs bg-red-50 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100">
                    ✕ Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Incidencias;