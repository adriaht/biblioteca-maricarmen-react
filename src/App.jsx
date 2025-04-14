
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
import Prestacs from "./pages/Prestacs";
import PrestacUsuario from "./pages/PrestacUsuario"
import AppRoutes from "./AppRoutes"


function App() {

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(""); // ✔️ Guarda el token a nivel global
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("bookList");

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


  const handleNavigateToCSVPage = () => {
    console.log("Navegando a CSV");
    setPage("CSV");
  };

  const handleNavigateToPrestacPage = () => {
    console.log("Navegando a Prestac");
    setPage("Prestac");
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


  let content;

 
  console.log("rol: " + role);
  
  if (!isAuthenticated) {
    content = (<>
      <Navbar onLoginClick={handleNavigateToLoginPage} setRole={setRole} setAuthenticated={setAuthenticated} onCatalagClick={handleNavigateToSeeLandingPage} isToken={token} />
      <div className="main">

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
        ) : page === "bookList" ? (<>
          <BookList />
        </>
        ) : null}
      </div>
    </>
    );

  }else if (role === "admin") {

    window.location.href = "http://127.0.0.1:8000/admin/";
    return null;

  } else if (role === "bibliotecario") {
    console.log("estamos en biblioteca");
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
        />
        <div className="main">
          <Sidebar isToken={token} setRole={role} onPrestacClick={handleNavigateToPrestacPage} onCSVClick={handleNavigateToCSVPage} />

          {/* Verifica el valor de 'page' y muestra el contenido correspondiente */}
          {page === "Perfil" ? (
            <Perfil username={user} onBack={handleNavigateToSeeLandingPage} />
          ) : page === "bookList" ? (

            <BookList />
          ) : page === "CSV" ? (
            <CsvUpload />
          ) : page === "Prestac" ? (
            <Prestacs username={user} />
          ) : null}

        </div>
      </>
    );
  } else if (role === "usuari") {
    console.log("estamos en usuario");
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
        />
        <div className="main">
          <Sidebar isToken={token} setRole={role} onPrestacClick={handleNavigateToPrestacPage} onCSVClick={handleNavigateToCSVPage} />

          {/* Verifica el valor de 'page' y muestra el contenido correspondiente */}
          {page === "Perfil" ? (
            <Perfil username={user} onBack={handleNavigateToSeeLandingPage} />
          ) : page === "bookList" ? (
            <BookList />
          ) : page === "Prestac" ? (
            <PrestacUsuario username={user} />
          ) : null}
        </div>
      </>
    );
  } else if (role === "guest") {
    content = (<>
      <Navbar onCatalagClick={handleNavigateToSeeLandingPage} isToken={token} setRole={setRole} setAuthenticated={setAuthenticated} />
      <BookList />
    </>
    );
  } 


  return (
    <div className="main">

      {content}

    </div>
  );


  // Verificar si el usuario está autenticado al cargar la aplicación
}


export default App;