// src/pages/Login.jsx
import { useState, useEffect } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

function Login({ setAuthenticated, setUser, setRole, setGrupos }) {
  console.log("Login iniciado ...");

  const [username, setUsernameLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localGrupos, setLocalGrupos] = useState([]);
  const [token, setToken] = useState(""); // Para almacenar el token

  // Cargar credenciales desde localStorage
  useEffect(() => {
    console.log("Cargando credenciales de localStorage");
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsernameLocal(storedUsername);
      setPasswordLocal(storedPassword);
    }
  }, []);

  useEffect(() => {
    console.log("Grupos actualizados:", localGrupos);
  }, [localGrupos]);

  const handleSaveCredentials = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    console.log("Credenciales guardadas:", { username, password });
  };

  const handleLogin = async () => {
    console.log("Botón de login clickeado");
    handleSaveCredentials();

    try {
      console.log("Enviando solicitud con:", { username, password });
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Respuesta de login:", data);

      if (data.exists) {
        console.log("Grupos del usuario:", data.grupos);
        setLocalGrupos(data.grupos);
        setUser(username);
        setAuthenticated(true);
        setGrupos(data.grupos);

        // Asignar token y mostrarlo
        const receivedToken = data.token;  // Aquí supongo que el token viene en data.token
        console.log("Token recibido:", receivedToken);
        setToken(receivedToken); // Guardar el token en el estado local

        // Definir el rol según los grupos del usuario
        if (data.grupos.includes("Bibliotecario")) {
          setRole("bibliotecario");
        } else if (data.grupos.includes("usuari")) {
          setRole("usuari");
        } else {
          setRole("guest");
        }
      } else {
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(error.message);
      setAuthenticated(false);
    }
  };

  return (
    <div>
      <Header level={2}>Login</Header>
      <LabelInput
        label="Username"
        type="text"
        value={username}
        placeholder="Introduce tu nombre de usuario"
        onChange={(e) => setUsernameLocal(e.target.value)}
        autoComplete="username"
      />
      <LabelInput
        label="Password"
        type="password"
        value={password}
        placeholder="Introduce tu contraseña"
        onChange={(e) => setPasswordLocal(e.target.value)}
        autoComplete="current-password"
      />
      <Button text="Iniciar sesión" onClick={handleLogin} />
      {errorMessage && (
        <Paragraph style={{ color: "red" }}>{errorMessage}</Paragraph>
      )}
    </div>
  );
}

export default Login;
