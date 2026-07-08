import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Incidencias from './pages/Incidencias';
import Asistencia from './pages/Asistencia';
import Horarios from './pages/Horarios';
import RutaProtegida from './components/RutaProtegida';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <RutaProtegida rolesPermitidos={['SuperAdmin','TalentoHumano','Supervisor']}>
            <Dashboard />
          </RutaProtegida>
        } />

        <Route path="/empleados" element={
          <RutaProtegida rolesPermitidos={['SuperAdmin','TalentoHumano']}>
            <Empleados />
          </RutaProtegida>
        } />

        <Route path="/incidencias" element={
          <RutaProtegida rolesPermitidos={['SuperAdmin','TalentoHumano','Supervisor']}>
            <Incidencias />
          </RutaProtegida>
        } />

        <Route path="/asistencia" element={
          <RutaProtegida rolesPermitidos={['SuperAdmin','TalentoHumano','Supervisor']}>
            <Asistencia />
          </RutaProtegida>
        } />

        <Route path="/horarios" element={
          <RutaProtegida rolesPermitidos={['SuperAdmin','TalentoHumano','Supervisor']}>
            <Horarios />
          </RutaProtegida>
        } />

        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;