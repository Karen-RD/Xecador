import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { colaboradoresDemo, asistenciaDemo } from '../services/datosDemo';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['L','M','M','J','V','S','D'];

const CHIP_STYLES = {
  A: { bg: '#E8F5E9', color: '#2E7D32', label: 'Asistió' },
  R: { bg: '#FFF8E1', color: '#F9A825', label: 'Retardo' },
  F: { bg: '#FFEBEE', color: '#C62828', label: 'Falta' },
  V: { bg: '#E3F2FD', color: '#1565C0', label: 'Vacaciones' },
  G: { bg: '#FFF3E0', color: '#E65100', label: 'Guardia' },
};

function getDiasCalendario(anio, mes) {
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  // Ajustar para que lunes sea el primer día
  const offset = primerDia === 0 ? 6 : primerDia - 1;
  const dias = [];
  // Días vacíos al inicio
  for (let i = 0; i < offset; i++) dias.push(null);
  // Días del mes
  for (let d = 1; d <= totalDias; d++) {
    const fecha = new Date(anio, mes, d);
    dias.push({
      dia: d,
      fecha: `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
      diaSemana: fecha.getDay(),
      esFinSemana: fecha.getDay() === 0 || fecha.getDay() === 6,
    });
  }
  return dias;
}

function getDiasSemana(fechaBase) {
  const base = new Date(fechaBase);
  const diaSemana = base.getDay();
  const lunes = new Date(base);
  lunes.setDate(base.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return {
      dia: d.getDate(),
      fecha: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      diaSemana: d.getDay(),
      esFinSemana: d.getDay() === 0 || d.getDay() === 6,
      nombreDia: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()],
    };
  });
}

function Asistencia() {
  const hoy = new Date();
  const [vista, setVista] = useState('Mes');
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [fechaBase, setFechaBase] = useState(hoy);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(null);
  const rol = localStorage.getItem('rol');

  const colaboradores = rol === 'Supervisor'
    ? colaboradoresDemo.filter(c => c.area === 'Mesa de Ayuda y Soporte Técnico')
    : colaboradoresDemo;

  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;

  const getRegistros = (fecha) =>
    asistenciaDemo.filter(a => a.fecha === fecha);

  const getEstadoColab = (colaboradorId, fecha) =>
    asistenciaDemo.find(a => a.colaboradorId === colaboradorId && a.fecha === fecha);

  const navAnterior = () => {
    if (vista === 'Mes') {
      if (mes === 0) { setMes(11); setAnio(anio - 1); }
      else setMes(mes - 1);
    } else if (vista === 'Semana') {
      const n = new Date(fechaBase); n.setDate(n.getDate() - 7); setFechaBase(n);
    } else {
      const n = new Date(fechaBase); n.setDate(n.getDate() - 1); setFechaBase(n);
    }
  };

  const navSiguiente = () => {
    if (vista === 'Mes') {
      if (mes === 11) { setMes(0); setAnio(anio + 1); }
      else setMes(mes + 1);
    } else if (vista === 'Semana') {
      const n = new Date(fechaBase); n.setDate(n.getDate() + 7); setFechaBase(n);
    } else {
      const n = new Date(fechaBase); n.setDate(n.getDate() + 1); setFechaBase(n);
    }
  };

  const tituloNav = () => {
    if (vista === 'Mes') return `${MESES[mes].toUpperCase()} ${anio}`;
    if (vista === 'Semana') {
      const sem = getDiasSemana(fechaBase);
      return `${sem[0].dia} – ${sem[6].dia} ${MESES[mes]} ${anio}`;
    }
    return `${fechaBase.getDate()} de ${MESES[fechaBase.getMonth()]} ${anio}`;
  };

  // ── Render vista MES — calendario cuadrícula
  const renderMes = () => {
    const dias = getDiasCalendario(anio, mes);
    const semanas = [];
    for (let i = 0; i < dias.length; i += 7) semanas.push(dias.slice(i, i + 7));

    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Encabezado días semana */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DIAS_SEMANA.map((d, i) => (
            <div key={i} className={`py-2 text-center text-xs font-bold uppercase ${i >= 5 ? 'text-orange-400' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Semanas */}
        {semanas.map((semana, si) => (
          <div key={si} className="grid grid-cols-7 border-b border-gray-100 last:border-0">
            {semana.map((dia, di) => {
              if (!dia) return <div key={di} className="min-h-24 bg-gray-50/50 border-r border-gray-100 last:border-0" />;

              const esHoy = dia.fecha === hoyStr;
              const registrosDelDia = getRegistros(dia.fecha);
              const guardiasDia = colaboradores.filter(c =>
                (c.guardia === 'Sábados' && dia.diaSemana === 6) ||
                (c.guardia === 'Domingos' && dia.diaSemana === 0) ||
                (c.guardia === 'Sábados y Domingos' && dia.esFinSemana)
              );

              return (
                <div key={di}
                  onClick={() => { setDiaSeleccionado(diaSeleccionado === dia.fecha ? null : dia.fecha); setPanelAbierto(null); }}
                  className={`min-h-24 p-2 border-r border-gray-100 last:border-0 cursor-pointer transition
                    ${dia.esFinSemana ? 'bg-orange-50/30' : 'bg-white'}
                    ${diaSeleccionado === dia.fecha ? 'ring-2 ring-inset ring-green-500' : 'hover:bg-gray-50'}
                  `}>
                  {/* Número del día */}
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                      ${esHoy ? 'bg-green-600 text-white' : dia.esFinSemana ? 'text-orange-400' : 'text-gray-700'}`}>
                      {dia.dia}
                    </span>
                    {/* Indicador apertura/cierre */}
                    {dia.diaSemana === 1 && <span className="text-xs bg-green-600 text-white px-1 rounded" style={{fontSize:'8px'}}>APE</span>}
                    {dia.diaSemana === 5 && <span className="text-xs bg-red-500 text-white px-1 rounded" style={{fontSize:'8px'}}>CIE</span>}
                  </div>

                  {/* Chips de asistencia */}
                  <div className="space-y-0.5">
                    {registrosDelDia.slice(0, 3).map((r, ri) => {
                      const colab = colaboradores.find(c => c.id === r.colaboradorId);
                      if (!colab) return null;
                      const estilo = CHIP_STYLES[r.estado];
                      return (
                        <div key={ri} className="flex items-center gap-1 rounded px-1 py-0.5"
                          style={{ background: estilo?.bg }}>
                          <span className="text-xs font-bold" style={{ color: estilo?.color, fontSize: '9px' }}>
                            {r.estado}
                          </span>
                          <span className="truncate text-gray-600" style={{ fontSize: '9px' }}>
                            {colab.nombre.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                    {/* Guardias fin de semana */}
                    {dia.esFinSemana && guardiasDia.slice(0, 2).map((c, gi) => (
                      <div key={gi} className="flex items-center gap-1 rounded px-1 py-0.5"
                        style={{ background: CHIP_STYLES.G.bg }}>
                        <span className="text-xs font-bold" style={{ color: CHIP_STYLES.G.color, fontSize: '9px' }}>G</span>
                        <span className="truncate text-gray-600" style={{ fontSize: '9px' }}>{c.nombre.split(' ')[0]}</span>
                      </div>
                    ))}
                    {registrosDelDia.length > 3 && (
                      <div className="text-xs text-gray-400" style={{ fontSize: '9px' }}>+{registrosDelDia.length - 3} más</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // ── Render vista SEMANA — tabla por colaborador
  const renderSemana = () => {
    const dias = getDiasSemana(fechaBase);
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-400 uppercase min-w-40">Colaborador</th>
              {dias.map((d, i) => (
                <th key={i} className={`px-2 py-3 text-center text-xs font-bold uppercase min-w-20 ${d.esFinSemana ? 'text-orange-400' : 'text-gray-400'}`}>
                  <div>{d.nombreDia}</div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 text-sm font-bold
                    ${d.fecha === hoyStr ? 'bg-green-600 text-white' : 'text-gray-700'}`}>
                    {d.dia}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colaboradores.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-3">
                  <span onClick={() => setPanelAbierto(panelAbierto === c.id ? null : c.id)}
                    className="font-semibold text-blue-600 cursor-pointer hover:underline text-sm">
                    {c.nombre.split(' ').slice(0,2).join(' ')}
                  </span>
                  <p className="text-xs text-gray-400">{c.codigo}</p>
                </td>
                {dias.map((d, i) => {
                  const registro = getEstadoColab(c.id, d.fecha);
                  const esApertura = d.diaSemana === 1 && c.id === 1;
                  const esCierre = d.diaSemana === 5 && c.id === 1;
                  const esGuardia = d.esFinSemana && (
                    (c.guardia === 'Sábados' && d.diaSemana === 6) ||
                    (c.guardia === 'Domingos' && d.diaSemana === 0) ||
                    c.guardia === 'Sábados y Domingos'
                  );
                  return (
                    <td key={i} className={`px-2 py-3 text-center ${d.esFinSemana ? 'bg-orange-50/30' : ''}`}>
                      {esApertura ? (
                        <span className="text-xs font-bold bg-green-600 text-white px-1.5 py-0.5 rounded">APE</span>
                      ) : esCierre ? (
                        <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">CIE</span>
                      ) : esGuardia ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background: CHIP_STYLES.G.bg, color: CHIP_STYLES.G.color}}>G</span>
                      ) : registro ? (
                        <div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{background: CHIP_STYLES[registro.estado]?.bg, color: CHIP_STYLES[registro.estado]?.color}}>
                            {registro.estado}
                          </span>
                          {registro.entrada && (
                            <p className="text-xs text-gray-400 mt-0.5">{registro.entrada}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-200">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ── Render vista DÍA
  const renderDia = () => {
    const diaStr = `${fechaBase.getFullYear()}-${String(fechaBase.getMonth()+1).padStart(2,'0')}-${String(fechaBase.getDate()).padStart(2,'0')}`;
    const esFinSemana = fechaBase.getDay() === 0 || fechaBase.getDay() === 6;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-600 mb-4">
          {['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][fechaBase.getDay()]} {fechaBase.getDate()} de {MESES[fechaBase.getMonth()]} {anio}
        </h2>
        <div className="space-y-2">
          {colaboradores.map(c => {
            const registro = getEstadoColab(c.id, diaStr);
            const esGuardia = esFinSemana && (
              (c.guardia === 'Sábados' && fechaBase.getDay() === 6) ||
              (c.guardia === 'Domingos' && fechaBase.getDay() === 0)
            );
            if (esFinSemana && !esGuardia) return null;
            const estilo = registro ? CHIP_STYLES[registro.estado] : null;
            return (
              <div key={c.id}
                onClick={() => setPanelAbierto(panelAbierto === c.id ? null : c.id)}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-green-300 transition">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                  {c.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{c.nombre}</p>
                  <p className="text-xs text-gray-400">{c.horario}</p>
                </div>
                {registro ? (
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{background: estilo?.bg, color: estilo?.color}}>
                      {estilo?.label}
                    </span>
                    {registro.entrada && (
                      <p className="text-xs text-gray-400 mt-1">{registro.entrada} → {registro.salida || '--:--'}</p>
                    )}
                  </div>
                ) : esGuardia ? (
                  <span className="text-xs font-bold px-2 py-1 rounded" style={{background: CHIP_STYLES.G.bg, color: CHIP_STYLES.G.color}}>Guardia</span>
                ) : (
                  <span className="text-xs text-gray-300">Sin registro</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Asistencia</h1>
            <p className="text-sm text-gray-500">Control de asistencia del personal</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filtro vista */}
            <div className="flex gap-1">
              {['Mes', 'Semana', 'Día'].map(v => (
                <button key={v} onClick={() => setVista(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${vista === v ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {v}
                </button>
              ))}
            </div>
            {/* Navegación */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
              <button onClick={navAnterior} className="text-gray-400 hover:text-gray-700 font-bold text-lg">‹</button>
              <span className="text-sm font-bold text-gray-700 min-w-44 text-center">{tituloNav()}</span>
              <button onClick={navSiguiente} className="text-gray-400 hover:text-gray-700 font-bold text-lg">›</button>
            </div>
            <button onClick={() => { setFechaBase(new Date()); setMes(hoy.getMonth()); setAnio(hoy.getFullYear()); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
              Hoy
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {Object.entries(CHIP_STYLES).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background: v.bg, color: v.color}}>{k}</span>
              <span className="text-xs text-gray-400">{v.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-600 text-white">APE</span>
            <span className="text-xs text-gray-400">Apertura</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500 text-white">CIE</span>
            <span className="text-xs text-gray-400">Cierre</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            {vista === 'Mes' && renderMes()}
            {vista === 'Semana' && renderSemana()}
            {vista === 'Día' && renderDia()}
          </div>

          {/* Panel lateral colaborador */}
          {panelAbierto && (() => {
            const c = colaboradoresDemo.find(x => x.id === panelAbierto);
            if (!c) return null;
            return (
              <div className="w-72 bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{c.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Código {c.codigo}</p>
                  </div>
                  <button onClick={() => setPanelAbierto(null)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-200">✕</button>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Información</p>
                  {[['Área', c.area], ['Puesto', c.puesto], ['Horario', c.horario], ['Guardia', c.guardia]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-semibold text-gray-700">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Checadas recientes</p>
                  {asistenciaDemo.filter(a => a.colaboradorId === c.id).slice(0, 4).map((ch, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 mb-2 flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">{ch.fecha}</p>
                        <p className="text-sm font-bold text-gray-700">{ch.entrada || '--:--'} → {ch.salida || '--:--'}</p>
                      </div>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{background: CHIP_STYLES[ch.estado]?.bg, color: CHIP_STYLES[ch.estado]?.color}}>
                        {ch.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default Asistencia;