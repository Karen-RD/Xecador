import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function Incidencias() {
  const [incidencias, setIncidencias] = useState([]); // Empieza vacío
  const [empleados, setEmpleados] = useState([]); // Para cargar la lista de empleados
  const [filtro, setFiltro] = useState('Pendiente');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nueva, setNueva] = useState({ empleadoId: '', tipo: 'Vacaciones', fechaInicio: '', fechaFin: '' });
  const rol = localStorage.getItem('rol');

  // Cargar datos al abrir la pantalla
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resIncidencias = await fetch('http://localhost:5177/api/incidencias');
        if (resIncidencias.ok) setIncidencias(await resIncidencias.json());

        const resEmpleados = await fetch('http://localhost:5177/api/empleados');
        if (resEmpleados.ok) setEmpleados(await resEmpleados.json());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  const incFiltradas = filtro === 'Todas'
    ? incidencias
    : incidencias.filter(i => i.estatus === filtro);

  const handleGuardar = async () => {
    if (!nueva.empleadoId || !nueva.fechaInicio) return;

    // Buscamos el nombre del empleado seleccionado
    const empleadoSel = empleados.find(e => e.id === parseInt(nueva.empleadoId));

    const payload = {
      empleadoId: parseInt(nueva.empleadoId),
      nombreEmpleado: empleadoSel?.nombreCompleto || 'Desconocido',
      tipo: nueva.tipo,
      fechaInicio: nueva.fechaInicio,
      fechaFin: nueva.fechaFin || nueva.fechaInicio,
      estatus: 'Pendiente'
    };

    try {
      const respuesta = await fetch('http://localhost:5177/api/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (respuesta.ok) {
        const incidenciaGuardada = await respuesta.json();
        setIncidencias([...incidencias, incidenciaGuardada]);
        setMostrarForm(false);
        setNueva({ empleadoId: '', tipo: 'Vacaciones', fechaInicio: '', fechaFin: '' });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
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
              <select value={nueva.empleadoId} 
                onChange={e => setNueva({...nueva, empleadoId: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600 col-span-2">
                <option value="">Selecciona un empleado...</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nombreCompleto}</option>
                ))}
              </select>

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
                {inc.nombreEmpleado ? inc.nombreEmpleado.substring(0,2).toUpperCase() : 'XC'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{inc.nombreEmpleado}</p>
                <p className="text-xs text-gray-400">
                  {inc.tipo} · {inc.fechaInicio.split('T')[0]} {inc.fechaFin && inc.fechaFin !== inc.fechaInicio ? `→ ${inc.fechaFin.split('T')[0]}` : ''}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colorEstatus(inc.estatus)}`}>
                {inc.estatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Incidencias;