import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  colaboradoresDemo,
  unidadesDeNegocio,
  departamentos,
  puestos,
  tiposUnidad
} from '../services/datosDemo';

const TABS = ['Colaboradores', 'Unidades de Negocio', 'Áreas'];

function Empleados() {
  const [tab, setTab] = useState('Colaboradores');
  const [colaboradores, setColaboradores] = useState(colaboradoresDemo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const rol = localStorage.getItem('rol');

  // Form nuevo colaborador
  const [nuevoColab, setNuevoColab] = useState({
    codigo: '', nombre: '', unidadNegocio: '', area: '', puesto: '',
    horario: '', guardia: 'Ninguna'
  });

  // Unidades de negocio dadas de alta
  const [unidades, setUnidades] = useState(
    tiposUnidad.map((t, i) => ({ id: i+1, tipo: t, nombre: t === 'Parque' ? 'Xcaret' : 'Hotel Xcaret México' }))
  );
  const [nuevaUnidad, setNuevaUnidad] = useState({ tipo: 'Parque', nombre: '' });
  const [mostrarFormUnidad, setMostrarFormUnidad] = useState(false);

  // Áreas dadas de alta
  const [areas, setAreas] = useState([
    { id: 1, nombre: 'Mesa de Ayuda y Soporte Técnico' },
    { id: 2, nombre: 'Dirección de Sistemas' },
  ]);
  const [nuevaArea, setNuevaArea] = useState({ nombre: '' });
  const [mostrarFormArea, setMostrarFormArea] = useState(false);

  const colaboradoresFiltrados = colaboradores.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.codigo.includes(busqueda)
  );

  const handleAgregarColab = () => {
    if (!nuevoColab.codigo || !nuevoColab.nombre) return;
    setColaboradores([...colaboradores, {
      id: colaboradores.length + 1,
      ...nuevoColab,
      activo: true
    }]);
    setMostrarForm(false);
    setNuevoColab({ codigo: '', nombre: '', unidadNegocio: '', area: '', puesto: '', horario: '', guardia: 'Ninguna' });
  };

  const handleBaja = (id) => {
    setColaboradores(colaboradores.map(c =>
      c.id === id ? { ...c, activo: false } : c
    ));
  };

  const handleAgregarUnidad = () => {
    if (!nuevaUnidad.nombre) return;
    setUnidades([...unidades, { id: unidades.length + 1, ...nuevaUnidad }]);
    setNuevaUnidad({ tipo: 'Parque', nombre: '' });
    setMostrarFormUnidad(false);
  };

  const handleAgregarArea = () => {
    if (!nuevaArea.nombre) return;
    setAreas([...areas, { id: areas.length + 1, ...nuevaArea }]);
    setNuevaArea({ nombre: '' });
    setMostrarFormArea(false);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";
  const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-800">Gestión de Personal</h1>
          <p className="text-sm text-gray-500">Administra colaboradores, unidades de negocio y áreas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setMostrarForm(false); setMostrarFormUnidad(false); setMostrarFormArea(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ══ TAB: COLABORADORES ══ */}
        {tab === 'Colaboradores' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <input placeholder="🔍 Buscar por nombre o código..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:border-green-600" />
              {(rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
                <button onClick={() => setMostrarForm(!mostrarForm)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  + Nuevo colaborador
                </button>
              )}
            </div>

            {/* Formulario nuevo colaborador */}
            {mostrarForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Alta de colaborador</h2>
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Número de colaborador</label>
                    <input placeholder="Ej. 44708" value={nuevoColab.codigo}
                      onChange={e => setNuevoColab({...nuevoColab, codigo: e.target.value})}
                      className={inputCls} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre completo</label>
                    <input placeholder="Nombre completo del colaborador" value={nuevoColab.nombre}
                      onChange={e => setNuevoColab({...nuevoColab, nombre: e.target.value})}
                      className={inputCls} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Unidad de negocio</label>
                    <select value={nuevoColab.unidadNegocio}
                      onChange={e => setNuevoColab({...nuevoColab, unidadNegocio: e.target.value})}
                      className={selectCls}>
                      <option value="">Selecciona unidad de negocio</option>
                      {unidadesDeNegocio.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Área / Departamento</label>
                    <select value={nuevoColab.area}
                      onChange={e => setNuevoColab({...nuevoColab, area: e.target.value})}
                      className={selectCls}>
                      <option value="">Selecciona área</option>
                      {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Puesto</label>
                    <select value={nuevoColab.puesto}
                      onChange={e => setNuevoColab({...nuevoColab, puesto: e.target.value})}
                      className={selectCls}>
                      <option value="">Selecciona puesto</option>
                      {puestos.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Horario</label>
                    <input placeholder="Ej. 08:00–17:00" value={nuevoColab.horario}
                      onChange={e => setNuevoColab({...nuevoColab, horario: e.target.value})}
                      className={inputCls} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Guardia fin de semana</label>
                    <select value={nuevoColab.guardia}
                      onChange={e => setNuevoColab({...nuevoColab, guardia: e.target.value})}
                      className={selectCls}>
                      <option>Ninguna</option>
                      <option>Sábados</option>
                      <option>Domingos</option>
                      <option>Sábados y Domingos</option>
                    </select>
                  </div>

                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleAgregarColab}
                    className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                    Guardar colaborador
                  </button>
                  <button onClick={() => setMostrarForm(false)}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla colaboradores */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Unidad</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Área</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Puesto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradoresFiltrados.map(c => (
                    <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!c.activo ? 'opacity-40' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{c.codigo}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{c.nombre}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.unidadNegocio}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.area}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.puesto}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${c.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {c.activo ? 'Activo' : 'Baja'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-xs border border-gray-200 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50">Editar</button>
                          {c.activo && (rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
                            <button onClick={() => handleBaja(c.id)}
                              className="text-xs border border-red-100 px-2 py-1 rounded-md text-red-400 hover:bg-red-50">Baja</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ TAB: UNIDADES DE NEGOCIO ══ */}
        {tab === 'Unidades de Negocio' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{unidades.length} unidades registradas</p>
              {rol === 'SuperAdmin' && (
                <button onClick={() => setMostrarFormUnidad(!mostrarFormUnidad)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  + Nueva unidad de negocio
                </button>
              )}
            </div>

            {mostrarFormUnidad && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Nueva unidad de negocio</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tipo</label>
                    <select value={nuevaUnidad.tipo}
                      onChange={e => setNuevaUnidad({...nuevaUnidad, tipo: e.target.value})}
                      className={selectCls}>
                      <option>Parque</option>
                      <option>Hotel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre</label>
                    <select value={nuevaUnidad.nombre}
                      onChange={e => setNuevaUnidad({...nuevaUnidad, nombre: e.target.value})}
                      className={selectCls}>
                      <option value="">Selecciona unidad</option>
                      {unidadesDeNegocio.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleAgregarUnidad}
                    className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                    Guardar
                  </button>
                  <button onClick={() => setMostrarFormUnidad(false)}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {unidades.map(u => (
                <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${u.tipo === 'Parque' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {u.tipo === 'Parque' ? '🌿' : '🏨'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.nombre}</p>
                    <p className="text-xs text-gray-400">{u.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: ÁREAS ══ */}
        {tab === 'Áreas' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{areas.length} áreas registradas</p>
              {rol === 'SuperAdmin' && (
                <button onClick={() => setMostrarFormArea(!mostrarFormArea)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  + Nueva área
                </button>
              )}
            </div>

            {mostrarFormArea && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Nueva área / departamento</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Selecciona el área</label>
                  <select value={nuevaArea.nombre}
                    onChange={e => setNuevaArea({ nombre: e.target.value })}
                    className={selectCls}>
                    <option value="">Selecciona departamento</option>
                    {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleAgregarArea}
                    className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                    Guardar
                  </button>
                  <button onClick={() => setMostrarFormArea(false)}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {areas.map(a => (
                <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                    🏢
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{a.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Empleados;