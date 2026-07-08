import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getEmpleados = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/empleados', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getIncidencias = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/incidencias', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const aprobarIncidencia = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/incidencias/${id}/aprobar`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const rechazarIncidencia = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/incidencias/${id}/rechazar`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};