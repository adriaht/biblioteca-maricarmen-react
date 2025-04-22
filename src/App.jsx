// App.jsx
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

function App() {
  // Estados generales
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  // "page" controla la vista a mostrar. Si page === "detail", BookDetails se muestra.
  const [page, setPage] = useState("bookList");
  // Estado para almacenar el ID del libro seleccionado
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Funciones de navegación basadas en estado
  const handleNavigateToEditProfile = () => setPage("Perfil");
  const handleNavigateToSeeLandingPage = () => setPage("bookList");
  const handleNavigateToLoginPage = () => setPage("login");
  const handleNavigateToCSVPage = () => setPage("CSV");
  const handleNavigateToPrestacPage = () => setPage("Prestac");
  
  // Cuando se seleccione un libro, cambiamos a vista "detail"
  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setPage("detail");
  };

  // Función para volver de la vista de detalles a la lista
  const handleBackFromDetails = () => {
    setSelectedBookId(null);
    setPage("bookList");
  };

  useEffect(() => {
    // Ejemplo: verificar si hay un token guardado para autenticación
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthenticated(true);
    }
  }, []);

  let content = null;

  // Si no está autenticado, mostramos la vista de Login o BookList (público)
  if (!authenticated) {
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
          ) : page === "bookList" ? (
            <BookList onSelectBook={handleSelectBook} />
          ) : page === "detail" ? (
            <BookDetails bookId={selectedBookId} onBack={handleBackFromDetails} extraProp="Valor extra" />
          ) : null}
        </div>
      </>
    );
  }else if (role === "admin") {
    window.location.href = "http://127.0.0.1:8000/admin/";
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
            <BookDetails bookId={selectedBookId} onBack={handleBackFromDetails} extraProp="Valor extra" />
          ) : null}
        </div>
      </>
    );
  } else if (role === "usuari") {
    console.log("usuari rol")
    console.log(page)
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
            <BookDetails bookId={selectedBookId} onBack={handleBackFromDetails} extraProp="Valor extra" />
          ) : null}
        </div>
      </>
    );
  }
  return <div >{content}</div>;
}

export default App;
