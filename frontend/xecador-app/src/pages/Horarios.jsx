import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo } from '../services/datosDemo';

const horariosBase = [
  { id: 1, nombre: 'Turno Matutino',   inicio: '08:00', fin: '17:00', dias: 'Lunes a Viernes', horas: 48 },
  { id: 2, nombre: 'Turno Vespertino', inicio: '10:00', fin: '19:00', dias: 'Lunes a Viernes', horas: 48 },
  { id: 3, nombre: 'Turno Apertura',   inicio: '08:00', fin: '17:00', dias: 'Lunes (apertura 8am)', horas: 48 },
  { id: 4, nombre: 'Turno Cierre',     inicio: '10:00', fin: '19:00', dias: 'Viernes (cierre 7pm)', horas: 48 },
];

const diasFestivos2026 = [
  { fecha: '2026-01-01', nombre: 'Año Nuevo' },
  { fecha: '2026-02-02', nombre: 'Día de la Constitución' },
  { fecha: '2026-03-16', nombre: 'Natalicio de Benito Juárez' },
  { fecha: '2026-04-02', nombre: 'Jueves Santo' },
  { fecha: '2026-04-03', nombre: 'Viernes Santo' },
  { fecha: '2026-05-01', nombre: 'Día del Trabajo' },
  { fecha: '2026-09-16', nombre: 'Día de la Independencia' },
  { fecha: '2026-11-02', nombre: 'Día de Muertos' },
  { fecha: '2026-11-16', nombre: 'Revolución Mexicana' },
  { fecha: '2026-12-25', nombre: 'Navidad' },
];

const TABS = ['Horarios', 'Asignación', 'Guardias Festivos'];

function Horarios() {
  const [tab, setTab] = useState('Horarios');
  const [horarios, setHorarios] = useState(horariosBase);
  const [colaboradores, setColaboradores] = useState(
    colaboradoresDemo.map(c => ({ ...c, horarioAsignado: c.horario || '' }))
  );
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: '', inicio: '', fin: '', dias: '', horas: 48 });

  // Asignación de horario
  const [colabSel, setColabSel] = useState('');
  const [horarioSel, setHorarioSel] = useState('');

  // Guardias festivos
  const [guardias, setGuardias] = useState([]);
  const [guardiaForm, setGuardiaForm] = useState({ colaboradorId: '', festivoFecha: '', festivoNombre: '' });

  const rol = localStorage.getItem('rol');

  const handleGuardarHorario = () => {
    if (!nuevo.nombre || !nuevo.inicio || !nuevo.fin) return;
    setHorarios([...horarios, { id: horarios.length + 1, ...nuevo }]);
    setNuevo({ nombre: '', inicio: '', fin: '', dias: '', horas: 48 });
    setMostrarForm(false);
  };

  const handleAsignar = () => {
    if (!colabSel || !horarioSel) return;
    const horario = horarios.find(h => h.id === parseInt(horarioSel));
    setColaboradores(colaboradores.map(c =>
      c.id === parseInt(colabSel)
        ? { ...c, horarioAsignado: `${horario.inicio}–${horario.fin}`, horarioNombre: horario.nombre }
        : c
    ));
    setColabSel('');
    setHorarioSel('');
  };

  const handleGuardiaFestivo = () => {
    if (!guardiaForm.colaboradorId || !guardiaForm.festivoFecha) return;
    const colab = colaboradores.find(c => c.id === parseInt(guardiaForm.colaboradorId));
    const festivo = diasFestivos2026.find(f => f.fecha === guardiaForm.festivoFecha);
    setGuardias([...guardias, {
      id: guardias.length + 1,
      colaborador: colab?.nombre,
      fecha: guardiaForm.festivoFecha,
      festivo: festivo?.nombre || guardiaForm.festivoNombre,
    }]);
    setGuardiaForm({ colaboradorId: '', festivoFecha: '', festivoNombre: '' });
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";
  const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-800">Horarios</h1>
          <p className="text-sm text-gray-500">Gestión de jornadas laborales — 48 hrs semanales</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ══ TAB: HORARIOS ══ */}
        {tab === 'Horarios' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{horarios.length} horarios disponibles</p>
              {(rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
                <button onClick={() => setMostrarForm(!mostrarForm)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  + Nuevo horario
                </button>
              )}
            </div>

            {mostrarForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Nuevo horario</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre del turno</label>
                    <input placeholder="Ej. Turno Nocturno" value={nuevo.nombre}
                      onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Hora inicio</label>
                    <input type="time" value={nuevo.inicio}
                      onChange={e => setNuevo({...nuevo, inicio: e.target.value})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Hora fin</label>
                    <input type="time" value={nuevo.fin}
                      onChange={e => setNuevo({...nuevo, fin: e.target.value})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Días</label>
                    <input placeholder="Ej. Lunes a Viernes" value={nuevo.dias}
                      onChange={e => setNuevo({...nuevo, dias: e.target.value})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Horas semanales</label>
                    <input type="number" value={nuevo.horas}
                      onChange={e => setNuevo({...nuevo, horas: parseInt(e.target.value)})}
                      className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleGuardarHorario}
                    className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold">Guardar</button>
                  <button onClick={() => setMostrarForm(false)}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm">Cancelar</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {horarios.map(h => (
                <div key={h.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {h.horas}h
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{h.nombre}</p>
                    <p className="text-xs text-gray-400">{h.inicio} – {h.fin} · {h.dias}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: ASIGNACIÓN ══ */}
        {tab === 'Asignación' && (
          <div className="grid grid-cols-2 gap-4">

            {/* Formulario asignación */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4">Asignar horario a colaborador</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Colaborador</label>
                  <select value={colabSel} onChange={e => setColabSel(e.target.value)} className={selectCls}>
                    <option value="">Selecciona colaborador</option>
                    {colaboradores.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Horario</label>
                  <select value={horarioSel} onChange={e => setHorarioSel(e.target.value)} className={selectCls}>
                    <option value="">Selecciona horario</option>
                    {horarios.map(h => (
                      <option key={h.id} value={h.id}>{h.nombre} ({h.inicio}–{h.fin})</option>
                    ))}
                  </select>
                </div>

                {/* Vista previa */}
                {colabSel && horarioSel && (() => {
                  const c = colaboradores.find(x => x.id === parseInt(colabSel));
                  const h = horarios.find(x => x.id === parseInt(horarioSel));
                  return (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Vista previa</p>
                      <p className="text-sm font-semibold text-gray-800">{c?.nombre}</p>
                      <p className="text-xs text-gray-500">{h?.nombre} · {h?.inicio}–{h?.fin} · {h?.horas}hrs/sem</p>
                    </div>
                  );
                })()}

                <button onClick={handleAsignar}
                  className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800">
                  Asignar horario
                </button>
              </div>
            </div>

            {/* Lista de colaboradores con sus horarios */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase">Horarios asignados</h2>
              </div>
              {colaboradores.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                    {c.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                    <p className="text-xs text-gray-400">{c.codigo}</p>
                  </div>
                  {c.horarioNombre ? (
                    <div className="text-right">
                      <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                        {c.horarioNombre}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{c.horarioAsignado}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">Sin asignar</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: GUARDIAS FESTIVOS ══ */}
        {tab === 'Guardias Festivos' && (
          <div className="grid grid-cols-2 gap-4">

            {/* Formulario guardia festivo */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-1">Asignar guardia en día festivo</h2>
              <p className="text-xs text-gray-400 mb-4">Las guardias de fin de semana regular las asigna el supervisor en el calendario.</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Colaborador</label>
                  <select value={guardiaForm.colaboradorId}
                    onChange={e => setGuardiaForm({...guardiaForm, colaboradorId: e.target.value})}
                    className={selectCls}>
                    <option value="">Selecciona colaborador</option>
                    {colaboradores.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Día festivo</label>
                  <select value={guardiaForm.festivoFecha}
                    onChange={e => setGuardiaForm({...guardiaForm, festivoFecha: e.target.value})}
                    className={selectCls}>
                    <option value="">Selecciona día festivo</option>
                    {diasFestivos2026.map(f => (
                      <option key={f.fecha} value={f.fecha}>{f.nombre} — {f.fecha}</option>
                    ))}
                  </select>
                </div>

                <button onClick={handleGuardiaFestivo}
                  className="w-full bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800">
                  Asignar guardia festiva
                </button>
              </div>

              {/* Días festivos 2026 */}
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Días festivos 2026</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {diasFestivos2026.map(f => (
                    <div key={f.fecha} className="flex justify-between text-xs py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{f.nombre}</span>
                      <span className="text-gray-400">{f.fecha}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista guardias asignadas */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase">Guardias festivas asignadas</h2>
              </div>
              {guardias.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-2xl mb-2">🗓️</p>
                  <p className="text-sm text-gray-400">Sin guardias festivas asignadas</p>
                </div>
              ) : (
                guardias.map(g => (
                  <div key={g.id} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                      🛡️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{g.colaborador}</p>
                      <p className="text-xs text-gray-400">{g.festivo}</p>
                    </div>
                    <span className="text-xs font-semibold bg-orange-50 text-orange-500 px-2 py-1 rounded-md">
                      {g.fecha}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Horarios;