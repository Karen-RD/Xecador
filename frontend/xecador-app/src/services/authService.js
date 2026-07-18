import api from './api';

// Ajustamos el login para asegurar que maneje bien los errores
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error("Error en servicio de login:", error.response?.data || error.message);
    throw error;
  }
};

// Función helper para obtener el token y evitar repetir código
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getEmpleados = async () => {
  const response = await api.get('/empleados', getHeaders());
  return response.data;
};

export const getIncidencias = async () => {
  const response = await api.get('/incidencias', getHeaders());
  return response.data;
};

export const aprobarIncidencia = async (id) => {
  const response = await api.put(`/incidencias/${id}/aprobar`, {}, getHeaders());
  return response.data;
};

export const rechazarIncidencia = async (id) => {
  const response = await api.put(`/incidencias/${id}/rechazar`, {}, getHeaders());
  return response.data;
};