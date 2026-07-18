import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    try {
      const respuesta = await fetch("http://localhost:5177/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (respuesta.ok) {
        const data = await respuesta.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombre", data.nombre);

        navigate("/dashboard");
      } else {
        const errData = await respuesta.json();
        setError(errData.message || "Correo o contraseña incorrectos");
      }
    } catch (err) {
      setError(
        "Error al conectar con el servidor. Verifica que el API esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,35,23,.45), rgba(8,35,23,.45)), url('/portada.jpg')",
      }}
    >
      {/* Logo izquierdo */}
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
          alt="Grupo Xcaret"
        />
      </div>

      {/* Tarjeta */}
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
              alt="Xecador"
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/90 px-4 py-3 mb-5 outline-none"
              required
            />

            <label className="block text-white text-sm mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/90 px-4 py-3 mb-6 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white hover:bg-green-800 transition"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-4 text-white">o</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>

          <button
            className="w-full rounded-xl bg-white py-3 font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Continuar con Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;