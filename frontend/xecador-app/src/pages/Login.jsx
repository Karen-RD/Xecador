<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
>>>>>>> 43cfd2f3c465278dbfd8bf9ffed5f8d7b2a01691

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

<<<<<<< HEAD
    try {
      // Conexión real a tu backend
      const respuesta = await fetch('http://localhost:5177/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos el email y el password tal como los espera tu LoginDto en C#
        body: JSON.stringify({ email, password }) 
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        // Guardamos el token y los datos reales que vienen de MySQL
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('nombre', data.nombre);
        navigate('/dashboard');
      } else {
        const errData = await respuesta.json();
        setError(errData.message || 'Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Verifica que el API esté corriendo.');
    } finally {
=======
    // ======== LOGIN DE PRUEBA ========

    setTimeout(() => {
      const usuarios = {
        "admin@xcaret.com": {
          token: "token-sa",
          rol: "SuperAdmin",
          nombre: "Karen Rojas",
        },
        "rh@xcaret.com": {
          token: "token-rh",
          rol: "TalentoHumano",
          nombre: "Admin RH",
        },
        "supervisor@xcaret.com": {
          token: "token-sp",
          rol: "Supervisor",
          nombre: "Victor Ku Poot",
        },
      };

      const usuario = usuarios[email];

      if (usuario && password === "123456") {
        localStorage.setItem("token", usuario.token);
        localStorage.setItem("rol", usuario.rol);
        localStorage.setItem("nombre", usuario.nombre);

        navigate("/dashboard");
      } else {
        setError("Correo o contraseña incorrectos");
      }

>>>>>>> 43cfd2f3c465278dbfd8bf9ffed5f8d7b2a01691
      setLoading(false);
    }, 800);

    /*
    ======== CUANDO CONECTES EL BACKEND ========

    try{
        const data = await login(email,password);

        localStorage.setItem("token",data.token);
        localStorage.setItem("rol",data.rol);
        localStorage.setItem("nombre",data.nombre);

        navigate("/dashboard");
    }
    catch{
        setError("Correo o contraseña incorrectos");
    }
    finally{
        setLoading(false);
    }

    */
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,35,23,.45), rgba(8,35,23,.45)), url('/portada.jpg')",
      }}
    >
      {/* LOGO SOBRE LA IMAGEN */}

      <div className="absolute top-10 left-10 text-white max-w-lg z-20">
        <img
          src="/xecador.png"
          alt="Xecador"
          className="w-72 mb-8"
        />

        <h2 className="text-4xl font-bold mb-4">
          Xecador
        </h2>

       

        <img
          src="/grupoxcaret.png"
          className="w-56 mt-12"
          alt=""
        />
      </div>

      {/* TARJETA */}

      <div className="flex justify-end items-center min-h-screen pr-20">

        <div
          className="
          w-full
          max-w-md

          rounded-3xl

          p-10

          border

          border-white/20

          bg-white/20

          backdrop-blur-xl

          shadow-2xl
          "
        >

          <div className="flex justify-center mb-8">
            <img
              src="/xecador.png"
              className="w-52"
              alt=""
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-white">
            Iniciar sesión
          </h1>

          <p className="text-center text-white/80 mt-2 mb-8">
            Ingresa tus credenciales corporativas
          </p>

          {error && (
            <div className="mb-5 rounded-xl bg-red-500/20 border border-red-300 text-white px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label className="block text-white text-sm mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="usuario@xcaret.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="
              w-full
              rounded-xl
              bg-white/90
              px-4
              py-3
              mb-5
              outline-none
              "
            />

            <label className="block text-white text-sm mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="
              w-full
              rounded-xl
              bg-white/90
              px-4
              py-3
              mb-6
              outline-none
              "
            />

            <button
              disabled={loading}
              className="
              w-full

              rounded-xl

              bg-green-700

              py-3

              font-semibold

              text-white

              hover:bg-green-800

              transition
              "
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/30"></div>

            <span className="px-4 text-white">
              o
            </span>

            <div className="flex-1 border-t border-white/30"></div>
          </div>

          <button
            className="
            w-full

            rounded-xl

            bg-white

            py-3

            font-medium

            text-gray-700

            hover:bg-gray-100

            transition
            "
          >
            Continuar con Microsoft
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;