import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
     setTimeout(() => {
    if (email && password) {
      localStorage.setItem('token', 'token-prueba-xecador');
      localStorage.setItem('rol', 'SuperAdmin');
      localStorage.setItem('nombre', 'Karen Rojas');
      navigate('/dashboard');
    } else {
      setError('Ingresa correo y contraseña');
    }
    setLoading(false);
  }, 800);


    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('nombre', data.nombre);
      navigate('/dashboard');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Foto Xcaret */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/portada.jpg')" }}
      >
        <div className="absolute inset-0 bg-green-900/40"></div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mb-6">Ingresa tus credenciales corporativas</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@xcaret.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:border-green-600"
            />

            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 text-sm focus:outline-none focus:border-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <button className="w-full mt-3 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
            Iniciar sesión rápida con Outlook
          </button>

          <div className="flex justify-center mt-10">
            <span className="text-lg font-bold text-gray-800">
              Xe<span className="text-green-700">cador</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;