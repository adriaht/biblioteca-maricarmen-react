import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './styles.css';
import Login from "./pages/Login";
import UsuarioView from "./pages/UsuarioView";
import BibliotecarioView from "./pages/BibliotecarioView";
import Perfil from "./pages/Perfil";
import Sidebar from "./components/Sidebar";
import './styles/tailwind.css'; // Importado de HEAD
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import Navbar from './components/Navbar';
import CsvUpload from "./components/CsvUpload"; // Importado de HEAD
import Paragraph from "./components/Paragraph";



function App() {

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(""); // ✔️ Guarda el token a nivel global
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("home");

  const handleNavigateToEditProfile = () => {
    console.log("Navegando a Perfil");
    setPage("Perfil");
  };

  const handleNavigateToSeeLandingPage = () => {
    console.log("Navegando a booklidt");
    setPage("bookList");
  };

  const handleNavigateToLoginPage = () => {
    console.log("Navegando a login");
    setPage("login");
  };
  const handleBackToHome = () => {
    console.log("Navegando a home");
    setPage("home");
  };

  useEffect(() => {
    // Aquí puedes implementar tu lógica de autenticación
    // Por ejemplo, verificar si hay un token en localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthenticated(true);
    }
  }, []);
  
  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };
  



  if (!isAuthenticated) {
    return (<>
      <Navbar onLoginClick={handleNavigateToLoginPage} setRole={setRole} setAuthenticated ={setAuthenticated} onCatalagClick={handleNavigateToSeeLandingPage} isToken={token}/>
      {page === "login" ? (
          <Login
            setAuthenticated={setAuthenticated}
            setToken={setToken} 
            setUser={setUser}
            setRole={setRole}
            setGrupos={setGrupos}
            onCatalagClick={handleNavigateToSeeLandingPage}
            backToLogin={handleNavigateToSeeLandingPage}
          />
        ) : (<>
          <BookList />
          </>
        )}
      </>
    );

  }

  let content;
console.log("rol: "+role);
 if (role === "admin") {
    
      window.location.href = "http://127.0.0.1:8000/admin/";
      return null;

   

  }else if (role === "bibliotecario") {
    console.log("estamos en biblioteca");
    return (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
        />
        <Paragraph>estamos en bibliotecario</Paragraph>

        {/* Verifica el valor de 'page' y muestra el contenido correspondiente */}
        {page === "Perfil" ? (
          <Perfil username={user} onBack={handleBackToHome} />
        ) : page === "bookList" ? (
          <BookList />
        ) : null}
      </>
    );
  } else if (role === "usuari") {
    console.log("estamos en usuario");
    return (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
        />
        <Paragraph>estamos en usuario</Paragraph>

        {/* Verifica el valor de 'page' y muestra el contenido correspondiente */}
        {page === "Perfil" ? (
          <Perfil username={user} onBack={handleBackToHome} />
        ) : page === "bookList" ? (
          <BookList />
        ) : null}
      </>
    );
  } else if (role === "guest"){
    content = (<>
     <Navbar onCatalagClick={handleNavigateToSeeLandingPage} isToken={token} setRole={setRole}  setAuthenticated ={setAuthenticated}/>
     <BookList />
      </>
    );
  }else {
    content = <p>Rol desconocido</p>;
  }


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


  // Verificar si el usuario está autenticado al cargar la aplicación
}
 

export default App;