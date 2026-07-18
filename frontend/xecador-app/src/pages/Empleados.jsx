import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { unidadesDeNegocio, departamentos, puestos } from '../services/datosDemo';

const TABS = ['Colaboradores', 'Unidades de Negocio', 'Áreas'];

function Empleados() {
  const [tab, setTab] = useState('Colaboradores');
  const [colaboradores, setColaboradores] = useState([]); // Iniciamos vacío
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const rol = localStorage.getItem('rol');

  const [nuevoColab, setNuevoColab] = useState({
    codigo: '', nombre: '', unidadNegocio: '', area: '', puesto: ''
  });

  // Unidades de negocio (Mock temporal)
  const [unidades, setUnidades] = useState([
    { id: 1, tipo: 'Parque', nombre: 'Xcaret', descripcion: 'Parque ecoturístico principal' },
  ]);
  const [mostrarFormUnidad, setMostrarFormUnidad] = useState(false);
  const [nuevaUnidad, setNuevaUnidad] = useState({ tipo: 'Parque', nombre: '', descripcion: '' });

  // Áreas (Mock temporal)
  const [areas, setAreas] = useState([
    { id: 1, nombre: 'Sistemas', descripcion: 'Soporte' },
  ]);
  const [mostrarFormArea, setMostrarFormArea] = useState(false);
  const [nuevaArea, setNuevaArea] = useState({ nombre: '', descripcion: '' });

  // 1. CARGAR DATOS DESDE LA BASE DE DATOS AL INICIAR
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const respuesta = await fetch('http://localhost:5177/api/empleados');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setColaboradores(datos);
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
      }
    };

    cargarEmpleados();
  }, []);

  const colaboradoresFiltrados = colaboradores.filter(c =>
    (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())) ||
    (c.codigo && c.codigo.includes(busqueda))
  );

  // 2. ENVIAR DATOS A LA BASE DE DATOS AL GUARDAR
  const handleAgregarColab = async () => {
    // Validación estricta para evitar que falten datos
    if (!nuevoColab.codigo || !nuevoColab.nombre || !nuevoColab.unidadNegocio || !nuevoColab.area || !nuevoColab.puesto) {
      alert("Por favor, llena todos los campos (incluyendo Unidad, Área y Puesto) antes de guardar.");
      return;
    }

    // Adaptamos el objeto para que coincida exactamente con las propiedades de tu modelo en C#
    const empleadoParaBD = {
      codigo: nuevoColab.codigo,
      nombreCompleto: nuevoColab.nombre,
      unidadNegocio: nuevoColab.unidadNegocio,
      area: nuevoColab.area,
      puesto: nuevoColab.puesto,
      horario: "08:00-17:00", // Valor por defecto
      guardia: "Ninguna",
      activo: true
    };

    try {
      const respuesta = await fetch('http://localhost:5177/api/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // <--- ESTA ES LA LLAVE DE SEGURIDAD
        },
        body: JSON.stringify(empleadoParaBD)
      });

      if (respuesta.ok) {
        const empleadoGuardado = await respuesta.json();
        // Agregamos el empleado que nos devuelve la base de datos a la vista
        setColaboradores([...colaboradores, empleadoGuardado]);
        setMostrarForm(false);
        setNuevoColab({ codigo: '', nombre: '', unidadNegocio: '', area: '', puesto: '' });
        alert("✅ Colaborador guardado con éxito en la base de datos.");
      } else {
        // LEEMOS EL ERROR EXACTO DEL BACKEND
        const errorText = await respuesta.text();
        console.error("Error devuelto por C#:", errorText);
        alert(`❌ Error al guardar (Código ${respuesta.status}).\n\nMotivo exacto: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la petición POST:", error);
      alert("❌ No se pudo conectar con el servidor.");
    }
  };

  const handleBaja = async (id) => {
    try {
      // Petición DELETE a tu API
      const respuesta = await fetch(`http://localhost:5177/api/empleados/${id}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        setColaboradores(colaboradores.map(c =>
          c.id === id ? { ...c, activo: false } : c
        ));
      }
    } catch (error) {
      console.error("Error al dar de baja:", error);
    }
  };

  const handleAgregarUnidad = () => { /* Pendiente conectar a DB */ };
  const handleAgregarArea = () => { /* Pendiente conectar a DB */ };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";
  const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 bg-white";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

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
              {(rol === 'SuperAdmin' || rol === 'TalentoHumano' || !rol) && (
                <button onClick={() => setMostrarForm(!mostrarForm)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  + Nuevo colaborador
                </button>
              )}
            </div>

            {mostrarForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-sm font-bold text-gray-700 mb-1">Alta de colaborador</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Número de colaborador</label>
                    <input placeholder="Ej. 44708" value={nuevoColab.codigo}
                      onChange={e => setNuevoColab({...nuevoColab, codigo: e.target.value})}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Nombre completo</label>
                    <input placeholder="Nombre completo" value={nuevoColab.nombre}
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
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleAgregarColab}
                    className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-800">
                    Guardar colaborador
                  </button>
                  <button onClick={() => setMostrarForm(false)}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

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
                      <td className="px-4 py-3 font-semibold text-gray-800">{c.nombreCompleto}</td>
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
                          {c.activo && (
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
        
        {/* Aquí siguen tus tabs de Unidades y Áreas sin cambios... */}
      </div>
    </div>
  );
}

export default Empleados;