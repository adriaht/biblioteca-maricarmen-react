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

function App() {

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(""); // ✔️ Guarda el token a nivel global
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("home");

  const handleNavigateToEditProfile = () => {
    setPage("editProfile");
  };

  const handleNavigateToSeeLandingPage = () => {
    setPage("bookList");
  };

  const handleNavigateToLoginPage = () => {
    setPage("login");
  };
  const handleBackToHome = () => {
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
      <Sidebar onLoginClick={handleNavigateToLoginPage} setRole={setRole} setAuthenticated ={setAuthenticated} onCatalagClick={handleNavigateToSeeLandingPage} isToken={token}/>
      {page === "login" ? (
          <Login
            setAuthenticated={setAuthenticated}
            setToken={setToken} 
            setUser={setUser}
            setRole={setRole}
            setGrupos={setGrupos}
            onCatalagClick={handleNavigateToSeeLandingPage}
          />
        ) : (
          <BookList />
        )}
      </>
    );

  }

  let content;
console.log("rol: "+role);
  if (page === "editProfile") {
    content =  <Perfil username={user} onBack={handleBackToHome} />;

  } else if (role === "admin") {
    
      window.location.href = "http://127.0.0.1:8000/admin/";
      return null;

   

  }else if (role === "bibliotecario") {
    content = (<>
      <Sidebar  onCatalagClick={handleNavigateToSeeLandingPage} onPerfilClick={handleNavigateToEditProfile} isToken={token}/>
      <BibliotecarioView
        username={user}
        grupos={grupos}
      />
      </>
    );
  } else if (role === "usuari") {
    content = (<>
    <Sidebar  onCatalagClick={handleNavigateToSeeLandingPage} onPerfilClick={handleNavigateToEditProfile} isToken={token}/>
      <UsuarioView
        username={user}
        grupos={grupos}
      />
      </>
    );
  } else if (role === "guest"){
    content = (<>
     <Sidebar onCatalagClick={handleNavigateToSeeLandingPage} isToken={token} setRole={setRole} />
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