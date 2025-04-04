import { useState, useEffect } from "react";

function Login() {
    console.log("Login iniciado ...");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [grupos, setGrupos] = useState([]);

    // Cargar credenciales desde localStorage
    useEffect(() => {
        console.log("Cargando credenciales de localStorage");
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, []);

    // Log para cuando se actualicen los grupos
    useEffect(() => {
        console.log("Grupos actualizados:", grupos);
    }, [grupos]);

    // Guardar credenciales en localStorage
    const handleSaveCredentials = () => {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        console.log("Credenciales guardadas:", { username, password });
    };

    // Función de login (sin <form> para evitar refresh)
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
                setGrupos(data.grupos); // Actualiza estado con grupos
                setIsAuthenticated(true);
            } else {
                throw new Error("Usuario no encontrado");
            }
        } catch (error) {
            console.error("Error en login:", error);
            setErrorMessage(error.message);
            setIsAuthenticated(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {!isAuthenticated ? (
                // Usamos un contenedor simple en lugar de un <form>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <h3>Bienvenido, {username}!</h3>

                    {grupos.length > 0 ? (
                        <>
                            <p>Grupos a los que perteneces:</p>
                            <ul>
                                {grupos.map((grupo, index) => (
                                    <li key={index}>{grupo}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No tienes grupos asignados.</p>
                    )}
                </div>
            )}
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}

export default Login;
