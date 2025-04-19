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

function App() {
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

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => setAuthenticated(true);

  if (!isAuthenticated) {
    return (
      <>
        <Navbar
          onLoginClick={handleNavigateToLoginPage}
          setRole={setRole}
          setAuthenticated={setAuthenticated}
          onCatalagClick={handleNavigateToSeeLandingPage}
          isToken={token}
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
        <a href="https://www.iesesteveterradas.cat/" target="_blank" rel="noopener noreferrer">
          <img src={gifBanner} alt="GIF de final de página" className="gif-banner" />
        </a>
      </>
    );
  }

  let content = null;
  if (role === "admin") {
    window.location.href = "https://biblioteca5.ieti.site/admin/";
    return null;
  } else if (role === "bibliotecario") {
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
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
    content = (
      <>
        <Navbar
          onCatalagClick={handleNavigateToSeeLandingPage}
          onPerfilClick={handleNavigateToEditProfile}
          isToken={token}
          setAuthenticated={setAuthenticated}
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

  return (
    <div className="main">
      {content}
      <a href="https://www.iesesteveterradas.cat/" target="_blank" rel="noopener noreferrer">
        <img src={gifBanner} alt="GIF de final de página" className="gif-banner" />
      </a>
    </div>
  );
}

export default App;
