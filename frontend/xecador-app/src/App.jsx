import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Incidencias from './pages/Incidencias';
import Asistencia from './pages/Asistencia';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/empleados" element={token ? <Empleados /> : <Navigate to="/login" />} />
        <Route path="/incidencias" element={token ? <Incidencias /> : <Navigate to="/login" />} />
        <Route path="/asistencia" element={token ? <Asistencia /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;