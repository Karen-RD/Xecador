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
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,35,23,.60), rgba(8,35,23,.60)), url('/portada.jpg')",
      }}
    >
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10">
          <img
            src="/grupoxcaret.png"
            alt="Grupo Xcaret"
            className="w-[420px] xl:w-[520px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* LADO DERECHO */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/20
              bg-white/20
              backdrop-blur-xl
              shadow-2xl
              p-8
              md:p-10
            "
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/xecador.png"
                alt="Xecador"
                className="w-56"
              />
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-center text-white">
              Iniciar sesión
            </h1>

            <p className="text-center text-white/80 mt-2 mb-8">
              Ingresa tus credenciales corporativas
            </p>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-500/20 border border-red-300 text-white px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-white text-sm mb-2">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  placeholder="usuario@xcaret.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    rounded-xl
                    bg-white/90
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    rounded-xl
                    bg-white/90
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-green-700
                  py-3
                  text-white
                  font-semibold
                  transition
                  hover:bg-green-800
                  disabled:opacity-50
                "
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            {/* Separador */}
            <div className="flex items-center my-7">
              <div className="flex-1 border-t border-white/30"></div>

              <span className="px-4 text-white text-sm">
                o
              </span>

              <div className="flex-1 border-t border-white/30"></div>
            </div>

            {/* Microsoft */}
            <button
              className="
                w-full
                rounded-xl
                bg-white
                py-3
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
              "
            >
              Continuar con Microsoft
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;