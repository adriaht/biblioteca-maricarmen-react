import { useState } from "react";
import './App.css';
import BookList from './components/BookList';
import './styles.css';
import Login from "./pages/Login";
import UsuarioView from "./pages/UsuarioView";
import BibliotecarioView from "./pages/BibliotecarioView";
import Perfil from "./pages/Perfil";
import Sidebar from "./components/Sidebar";

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
    setPage("landingPage");
  };

  const handleBackToHome = () => {
    setPage("home");
  };

  if (!isAuthenticated) {
    return (<>
      <Sidebar  onCatalagClick={handleNavigateToSeeLandingPage} isToken={token}/>
      <Login
        setAuthenticated={setAuthenticated}
        setToken={setToken} 
        setUser={setUser}
        setRole={setRole}
        setGrupos={setGrupos}
        onCatalagClick={handleNavigateToSeeLandingPage}
      />
      </>
    );

  }

  let content;

  if (page === "editProfile") {
    content =  <Perfil username={user} onBack={handleBackToHome} />;

  } else if (role === "bibliotecario") {
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
  } else {
    content = <p>Rol desconocido</p>;
  }

  return <div>{content}</div>;
}

export default App;