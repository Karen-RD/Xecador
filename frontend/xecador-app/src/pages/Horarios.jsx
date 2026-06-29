import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo } from '../services/datosDemo';

const horariosBase = [
  { id: 1, nombre: 'Turno Matutino', inicio: '08:00', fin: '17:00', dias: 'Lunes a Viernes', horas: 48 },
  { id: 2, nombre: 'Turno Vespertino', inicio: '10:00', fin: '19:00', dias: 'Lunes a Viernes', horas: 48 },
  { id: 3, nombre: 'Turno Apertura', inicio: '08:00', fin: '17:00', dias: 'Lunes (apertura)', horas: 48 },
  { id: 4, nombre: 'Turno Cierre', inicio: '10:00', fin: '19:00', dias: 'Viernes (cierre 7pm)', horas: 48 },
];

function Horarios() {
  const [horarios, setHorarios] = useState(horariosBase);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: '', inicio: '', fin: '', dias: '', horas: 48 });
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState('');
  const [horarioAsignado, setHorarioAsignado] = useState('');
  const [asignaciones, setAsignaciones] = useState([]);
  const rol = localStorage.getItem('rol');

  const handleGuardar = () => {
    if (!nuevo.nombre || !nuevo.inicio || !nuevo.fin) return;
    setHorarios([...horarios, { id: horarios.length + 1, ...nuevo }]);
    setMostrarForm(false);
    setNuevo({ nombre: '', inicio: '', fin: '', dias: '', horas: 48 });
  };

  const handleAsignar = () => {
    if (!colaboradorSeleccionado || !horarioAsignado) return;
    const colab = colaboradoresDemo.find(c => c.id === parseInt(colaboradorSeleccionado));
    const horario = horarios.find(h => h.id === parseInt(horarioAsignado));
    setAsignaciones([...asignaciones, {
      id: asignaciones.length + 1,
      colaborador: colab?.nombre,
      horario: horario?.nombre,
      inicio: horario?.inicio,
      fin: horario?.fin,
    }]);
    setColaboradorSeleccionado('');
    setHorarioAsignado('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Horarios</h1>
            <p className="text-sm text-gray-500">Gestión de jornadas laborales — 48 hrs semanales</p>
          </div>
          {(rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
            <button onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + Nuevo horario
            </button>
          )}
        </div>

        {/* Formulario nuevo horario */}
        {mostrarForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Nuevo horario</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre del turno" value={nuevo.nombre}
                onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 col-span-2" />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Hora inicio</label>
                <input type="time" value={nuevo.inicio}
                  onChange={e => setNuevo({...nuevo, inicio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Hora fin</label>
                <input type="time" value={nuevo.fin}
                  onChange={e => setNuevo({...nuevo, fin: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              </div>
              <input placeholder="Días (ej. Lunes a Viernes)" value={nuevo.dias}
                onChange={e => setNuevo({...nuevo, dias: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 col-span-2" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleGuardar}
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Guardar</button>
              <button onClick={() => setMostrarForm(false)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm">Cancelar</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Lista de horarios */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xs font-bold text-gray-400 uppercase">Horarios disponibles</h2>
            </div>
            {horarios.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                  {h.horas}h
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{h.nombre}</p>
                  <p className="text-xs text-gray-400">{h.inicio} – {h.fin} · {h.dias}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Asignar horario */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Asignar horario a colaborador</h2>
              <select value={colaboradorSeleccionado}
                onChange={e => setColaboradorSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-green-600">
                <option value="">Selecciona colaborador</option>
                {colaboradoresDemo.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <select value={horarioAsignado}
                onChange={e => setHorarioAsignado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-green-600">
                <option value="">Selecciona horario</option>
                {horarios.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre} ({h.inicio}–{h.fin})</option>
                ))}
              </select>
              <button onClick={handleAsignar}
                className="w-full bg-green-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                Asignar horario
              </button>
            </div>

            {/* Asignaciones realizadas */}
            {asignaciones.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xs font-bold text-gray-400 uppercase">Asignaciones realizadas</h2>
                </div>
                {asignaciones.map(a => (
                  <div key={a.id} className="p-3 border-b border-gray-100 last:border-0">
                    <p className="text-sm font-semibold text-gray-800">{a.colaborador}</p>
                    <p className="text-xs text-gray-400">{a.horario} · {a.inicio}–{a.fin}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horarios;