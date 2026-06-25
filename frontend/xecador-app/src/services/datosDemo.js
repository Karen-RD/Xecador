export const colaboradoresDemo = [
  { id: 1, codigo: '001', nombre: 'Jesus', area: 'SA Xelha', puesto: 'Ing. Soporte Técnico', horario: '08:00–17:00', guardia: 'Sábados', activo: true },
  { id: 2, codigo: '002', nombre: 'Victor', area: 'SA Xelha', puesto: 'Jefatura Operaciones TI', horario: '08:00–17:00', guardia: 'Domingos', activo: true },
  { id: 3, codigo: '003', nombre: 'Abisay', area: 'SA Xelha', puesto: 'Ing. Soporte Técnico', horario: '10:00–19:00', guardia: 'Ninguna', activo: true },
  { id: 4, codigo: '004', nombre: 'Alex', area: 'SA Xelha', puesto: 'Ing. Soporte Técnico', horario: '08:00–17:00', guardia: 'Ninguna', activo: true },
  { id: 5, codigo: '005', nombre: 'Felipe', area: 'SA Xelha', puesto: 'Ing. Soporte Técnico', horario: '08:00–17:00', guardia: 'Ninguna', activo: true },
];

export const incidenciasDemo = [
  { id: 1, colaboradorId: 3, nombre: 'Abisay', tipo: 'Vacaciones', fechaInicio: '2026-06-02', fechaFin: '2026-06-06', estatus: 'Pendiente' },
  { id: 2, colaboradorId: 4, nombre: 'Alex', tipo: 'Permiso', fechaInicio: '2026-06-10', fechaFin: '2026-06-10', estatus: 'Pendiente' },
  { id: 3, colaboradorId: 5, nombre: 'Felipe', tipo: 'Justificante', fechaInicio: '2026-05-26', fechaFin: '2026-05-26', estatus: 'Aprobado' },
];

export const asistenciaDemo = [
  { colaboradorId: 1, fecha: '2026-06-20', entrada: '07:52', salida: '17:05', estado: 'A' },
  { colaboradorId: 1, fecha: '2026-06-19', entrada: '08:10', salida: '17:00', estado: 'R' },
  { colaboradorId: 2, fecha: '2026-06-20', entrada: '08:00', salida: '17:00', estado: 'A' },
  { colaboradorId: 3, fecha: '2026-06-20', entrada: null, salida: null, estado: 'F' },
  { colaboradorId: 4, fecha: '2026-06-20', entrada: '08:05', salida: '17:00', estado: 'A' },
  { colaboradorId: 5, fecha: '2026-06-20', entrada: '08:00', salida: '17:00', estado: 'A' },
];
