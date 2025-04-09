

import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciales inválidas");
            }

            const data = await response.json();

            if (data.exists) {
                setIsAuthenticated(true);
            } else {
                throw new Error("Usuario no encontrado");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setIsAuthenticated(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {!isAuthenticated ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            ) : (
                <div>
                    <h3>Bienvenido, {username}!</h3>
                </div>
            )}
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}

export default Login;

