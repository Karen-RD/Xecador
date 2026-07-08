import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, rolesPermitidos }) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) return <Navigate to="/login" />;
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) return <Navigate to="/dashboard" />;
 
  return children;
}

export default RutaProtegida;