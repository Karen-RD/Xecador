import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo } from '../services/datosDemo';

function Empleados() {
  const [colaboradores, setColaboradores] = useState(colaboradoresDemo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoColaborador, setNuevoColaborador] = useState({
    nombre: '', codigo: '', area: '', puesto: '', horario: '', guardia: 'Ninguna'
  });

  const rol = localStorage.getItem('rol');

  const colaboradoresFiltrados = colaboradores.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.codigo.includes(busqueda)
  );

  const handleAgregar = () => {
    if (!nuevoColaborador.nombre || !nuevoColaborador.codigo) return;
    setColaboradores([...colaboradores, {
      id: colaboradores.length + 1,
      ...nuevoColaborador,
      activo: true
    }]);
    setMostrarForm(false);
    setNuevoColaborador({ nombre: '', codigo: '', area: '', puesto: '', horario: '', guardia: 'Ninguna' });
  };

  const handleBaja = (id) => {
    setColaboradores(colaboradores.map(c =>
      c.id === id ? { ...c, activo: false } : c
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Empleados</h1>
            <p className="text-sm text-gray-500">{colaboradores.filter(c => c.activo).length} colaboradores activos</p>
          </div>
          {(rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              + Nuevo colaborador
            </button>
          )}
        </div>

        {/* Formulario nuevo colaborador */}
        {mostrarForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Nuevo colaborador</h2>
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="Código" value={nuevoColaborador.codigo}
                onChange={e => setNuevoColaborador({...nuevoColaborador, codigo: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              <input placeholder="Nombre completo" value={nuevoColaborador.nombre}
                onChange={e => setNuevoColaborador({...nuevoColaborador, nombre: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 col-span-2" />
              <input placeholder="Área" value={nuevoColaborador.area}
                onChange={e => setNuevoColaborador({...nuevoColaborador, area: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              <input placeholder="Puesto" value={nuevoColaborador.puesto}
                onChange={e => setNuevoColaborador({...nuevoColaborador, puesto: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              <input placeholder="Horario (ej. 08:00–17:00)" value={nuevoColaborador.horario}
                onChange={e => setNuevoColaborador({...nuevoColaborador, horario: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
              <select value={nuevoColaborador.guardia}
                onChange={e => setNuevoColaborador({...nuevoColaborador, guardia: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600">
                <option>Ninguna</option>
                <option>Sábados</option>
                <option>Domingos</option>
                <option>Sábados y Domingos</option>
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAgregar}
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Guardar
              </button>
              <button onClick={() => setMostrarForm(false)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="🔍 Buscar por nombre o código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Área</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Horario</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Guardia</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {colaboradoresFiltrados.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${!c.activo ? 'opacity-40' : ''}`}>
                  <td className="px-4 py-3 font-mono text-gray-400 text-xs">{c.codigo}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{c.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{c.area}</td>
                  <td className="px-4 py-3 text-gray-500">{c.horario}</td>
                  <td className="px-4 py-3 text-gray-500">{c.guardia}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${c.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {c.activo ? 'Activo' : 'Baja'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs border border-gray-200 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50">
                        Editar
                      </button>
                      {c.activo && (rol === 'SuperAdmin' || rol === 'TalentoHumano') && (
                        <button onClick={() => handleBaja(c.id)}
                          className="text-xs border border-red-100 px-2 py-1 rounded-md text-red-400 hover:bg-red-50">
                          Baja
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Empleados;