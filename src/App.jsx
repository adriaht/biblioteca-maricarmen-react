import { useState, useEffect } from "react";
import "./styles.css";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Sidebar from "./components/Sidebar";
import "./styles/tailwind.css";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import Navbar from "./components/Navbar";
import CsvUpload from "./components/CsvUpload";
import Prestacs from "./pages/Prestacs";
import PrestacUsuario from "./pages/PrestacUsuario";
import gifBanner from "./assets/gifP3.gif";
import CrearPrestac from "./components/CrearPrestac";


function App() {
  // Estados generales
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("bookList");
  const [selectedBookId, setSelectedBookId] = useState(null);




  const handleNavigateToEditProfile = () => setPage("Perfil");
  const handleNavigateToSeeLandingPage = () => setPage("bookList");
  const handleNavigateToLoginPage = () => setPage("login");
  const handleNavigateToCSVPage = () => setPage("CSV");
  const handleNavigateToPrestacPage = () => setPage("Prestac");
  

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setPage("detail");
  };

  const handleBackFromDetails = () => {
    setSelectedBookId(null);
    setPage("bookList");
  };


  // Lógica para abrir el componente CrearReserva

    //boton reserva biblio
  const [crearPrestacBookId, setCrearPrestacBookId] = useState(null);
  const [crearPrestacBookTitle, setCrearPrestacBookTitle] = useState("");
  
  const handleAbrirCrearPrestac = (bookId) => {
    setCrearPrestacBookId(bookId);
    
    setPage("CrearPrestac");
  };
  

  
  


  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("username");
  
    if (storedToken && storedRole && storedUser) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(storedUser);
      setAuthenticated(true);
    }
  }, []);
  

  let content = null;

  // Si no está autenticado, mostramos la vista de Login o BookList (público)
  if (!isAuthenticated) {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("role:", role);
    console.log("page:", page);

    return (
      <>
        <Navbar
          onLoginClick={handleNavigateToLoginPage}
          setRole={setRole}
          setAuthenticated={setAuthenticated}
          onCatalagClick={handleNavigateToSeeLandingPage}
          isToken={token}
          changeToken={setToken}
        />
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

          ) : page === "CrearPrestac" ? (
            <CrearPrestac 
            bookId={crearPrestacBookId} 
            
            onBack={() => setPage("detail")}  
          />

          ) : page === "bookList" ? (
            <BookList onSelectBook={handleSelectBook} />
          ) : page === "detail" ? (
            <BookDetails 
              bookId={selectedBookId} 
              onBack={handleBackFromDetails} 
              extraProp="Valor extra"
              userRole={role}
              onCrearPrestac={handleAbrirCrearPrestac}  
              />
          ) : null}
        </div>
        <a href="https://www.iesesteveterradas.cat/" target="_blank" rel="noopener noreferrer">
          <img src={gifBanner} alt="GIF de final de página" className="gif-banner" />
        </a>
      </>
    );
  } else if (role === "admin") {
    window.location.href = 'cd ';

    return null;
  } else if (role === "bibliotecario") {
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
          changeToken={setToken}
        />
        <div className="main">
          <Sidebar
            isToken={token}
            setRole={role}
            onPrestacClick={handleNavigateToPrestacPage}
            onCSVClick={handleNavigateToCSVPage}
          />
          {page === "Perfil" ? (
            <Perfil username={user} onBack={handleNavigateToSeeLandingPage} />
         
          ) : page === "bookList" ? (
            <BookList onSelectBook={handleSelectBook} />
          ) : page === "CSV" ? (
            <CsvUpload />
          ) : page === "Prestac" ? (
            <Prestacs username={user} />
          ) : page === "detail" ? (
            <BookDetails
            bookId={selectedBookId}
            onBack={handleBackFromDetails}
            extraProp="Valor extra" 
            userRole={role} 
            onCrearPrestac={handleAbrirCrearPrestac} 
          />
        ) : page === "CrearPrestac" ? (
          <CrearPrestac 
            bookId={crearPrestacBookId} 
            onBack={() => setPage("detail")} 
          />
          ) : null}
        </div>
      </>
    );
  } else if (role === "usuari") {
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
          changeToken={setToken}
        />
        <div className="main">
          <Sidebar
            isToken={token}
            setRole={role}
            onPrestacClick={handleNavigateToPrestacPage}
            onCSVClick={handleNavigateToCSVPage}
          />
          {page === "Perfil" ? (
            <Perfil username={user} onBack={handleNavigateToSeeLandingPage} />
          ) : page === "bookList" ? (
            <BookList onSelectBook={handleSelectBook} />
          ) : page === "Prestac" ? (
            <PrestacUsuario username={user} />
          ) : page === "detail" ? (
            <BookDetails 
            bookId={selectedBookId} 
            onBack={handleBackFromDetails} 
            extraProp="Valor extra"
            userRole={role}
            onCrearPrestac={handleAbrirCrearPrestac} 
          />
          ) : null}
        </div>
      </>
    );
  } else if (role === "guest") {
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          isToken={token}
          setRole={setRole}
          setAuthenticated={setAuthenticated}
        />
        <BookList onSelectBook={handleSelectBook} />
      </>
    );
  } else {
    content = <p>Rol desconocido</p>;
  }

  return <div >{content}</div>;

}

export default App;
