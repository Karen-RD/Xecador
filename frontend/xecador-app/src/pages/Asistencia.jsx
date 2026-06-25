import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo, asistenciaDemo } from '../services/datosDemo';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const FECHAS = ['16', '17', '18', '19', '20', '21', '22'];
const FECHAS_COMPLETAS = ['2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22'];

const CHIP_STYLES = {
  A: 'bg-green-50 text-green-700',
  R: 'bg-yellow-50 text-yellow-600',
  F: 'bg-red-50 text-red-500',
  V: 'bg-blue-50 text-blue-600',
  G: 'bg-orange-50 text-orange-500',
};

function Asistencia() {
  const [filtro, setFiltro] = useState('Semana');
  const [panelAbierto, setPanelAbierto] = useState(null);

  const getEstado = (colaboradorId, fecha) => {
    const registro = asistenciaDemo.find(a => a.colaboradorId === colaboradorId && a.fecha === fecha);
    return registro ? registro.estado : '·';
  };

  const getChecadas = (colaboradorId) => {
    return asistenciaDemo.filter(a => a.colaboradorId === colaboradorId);
  };

  const colaboradorSeleccionado = panelAbierto
    ? colaboradoresDemo.find(c => c.id === panelAbierto)
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Asistencia</h1>
            <p className="text-sm text-gray-500">Junio 2026</p>
          </div>
          <div className="flex gap-2">
            {['Mes', 'Semana', 'Día'].map(f => (
              <button key={f} onClick={() => setFiltro(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${filtro === f ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 mb-4">
          {[['A','bg-green-50 text-green-700','Asistió'], ['R','bg-yellow-50 text-yellow-600','Retardo'], ['F','bg-red-50 text-red-500','Falta'], ['V','bg-blue-50 text-blue-600','Vacaciones'], ['G','bg-orange-50 text-orange-500','Guardia']].map(([key, cls, label]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${cls}`}>{key}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {/* Tabla */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-400 uppercase w-16">Cód.</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-400 uppercase">Nombre</th>
                  {DIAS.map((d, i) => (
                    <th key={i} className={`px-2 py-3 text-center text-xs font-bold uppercase ${i >= 5 ? 'text-orange-400' : 'text-gray-400'}`}>
                      {d}<br /><span className="font-normal">{FECHAS[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colaboradoresDemo.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3 font-mono text-xs text-gray-400">{c.codigo}</td>
                    <td className="px-3 py-3">
                      <span
                        onClick={() => setPanelAbierto(panelAbierto === c.id ? null : c.id)}
                        className="font-semibold text-blue-600 cursor-pointer hover:underline text-sm"
                      >
                        {c.nombre}
                      </span>
                    </td>
                    {FECHAS_COMPLETAS.map((fecha, i) => {
                      const estado = getEstado(c.id, fecha);
                      const esApertura = i === 0 && c.id === 1;
                      const esCierre = i === 4 && c.id === 1;
                      const esGuardia = (i === 5 && c.guardia === 'Sábados') || (i === 6 && c.guardia === 'Domingos');
                      return (
                        <td key={i} className={`px-2 py-3 text-center ${i >= 5 ? 'bg-orange-50/30' : ''}`}>
                          {esApertura ? (
                            <span className="text-xs font-bold bg-green-600 text-white px-1.5 py-0.5 rounded">APE</span>
                          ) : esCierre ? (
                            <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">CIE</span>
                          ) : esGuardia ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${CHIP_STYLES['G']}`}>G</span>
                          ) : estado !== '·' ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${CHIP_STYLES[estado] || ''}`}>{estado}</span>
                          ) : (
                            <span className="text-gray-300">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panel lateral */}
          {panelAbierto && colaboradorSeleccionado && (
            <div className="w-72 bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{colaboradorSeleccionado.nombre}</p>
                  <p className="text-xs text-gray-400">Código {colaboradorSeleccionado.codigo}</p>
                </div>
                <button onClick={() => setPanelAbierto(null)}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200">
                  ✕
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Información</p>
                {[
                  ['Área', colaboradorSeleccionado.area],
                  ['Puesto', colaboradorSeleccionado.puesto],
                  ['Horario', colaboradorSeleccionado.horario],
                  ['Guardia', colaboradorSeleccionado.guardia],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-semibold text-gray-700">{v}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Checadas recientes</p>
                {getChecadas(colaboradorSeleccionado.id).slice(0, 3).map((ch, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 mb-2 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-400">{ch.fecha}</p>
                      <p className="text-sm font-bold text-gray-700">
                        {ch.entrada || '--:--'} → {ch.salida || '--:--'}
                      </p>
                    </div>
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${CHIP_STYLES[ch.estado] || ''}`}>
                      {ch.estado}
                    </span>
                  </div>
                ))}
                {getChecadas(colaboradorSeleccionado.id).length === 0 && (
                  <p className="text-xs text-gray-400">Sin registros</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Asistencia;