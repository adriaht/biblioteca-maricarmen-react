import './App.css';
import './styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookList from './components/BookList';
import Login from './pages/Login';
import BookDetails from './components/BookDetails';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';

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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;