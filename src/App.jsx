import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import './styles.css';
import './styles/tailwind.css'; // Importado de HEAD
import BookList from './components/BookList';
import Login from './pages/Login';
import BookDetails from './components/BookDetails';
import Navbar from './components/Navbar';
import CsvUpload from "./components/CsvUpload"; // Importado de HEAD

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    // Aquí puedes implementar tu lógica de autenticación
    // Por ejemplo, verificar si hay un token en localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route
              path="/login"
              element={
                isAuthenticated ?
                <Navigate to="/" /> :
                <Login onLoginSuccess={handleLoginSuccess} />
              }
            />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/csv-upload" element={<CsvUpload />} /> {/* Nueva ruta para CsvUpload */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;