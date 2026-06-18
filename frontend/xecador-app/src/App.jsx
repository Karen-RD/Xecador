import logoXecador from "./assets/LogoX.png";
import "./App.css";

function App() {
  return (
    <div className="login-container">
      <div className="overlay">
        
        <div className="left-panel">
          <h1>XECADOR</h1>
          <h2>By Xcaret</h2>
        </div>

        <div className="login-card">
          <h2>Iniciar Sesión</h2>

          <input
            type="text"
            placeholder="Correo o usuario"
          />

          <input
            type="password"
            placeholder="Contraseña"
          />

          <button>
            Ingresar
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;