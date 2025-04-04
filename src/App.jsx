import { useState } from "react";
import './App.css';
import BookList from './components/BookList';
import './styles.css';
import Login from "./pages/Login";
import UsuarioView from "./pages/UsuarioView";
import BibliotecarioView from "./pages/BibliotecarioView";
import Perfil from "./pages/Perfil";


function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("home");

  const handleNavigateToEditProfile = () => {
    setPage("editProfile");
  };

  const handleBackToHome = () => {
    setPage("home");
  };

  if (!isAuthenticated) {
    return (
      <Login
        setAuthenticated={setAuthenticated}
        setUser={setUser}
        setRole={setRole}
        setGrupos={setGrupos}
      />
    );
  }

  let content;

  if (page === "editProfile") {
    content = (
      <Perfil
        userData={{ username: user, grupos }}
        onBack={handleBackToHome}
      />
    );
  } else if (role === "bibliotecario") {
    content = (
      <BibliotecarioView
        username={user}
        grupos={grupos}
        goToPerfil={handleNavigateToEditProfile}
      />
    );
  } else if (role === "usuari") {
    content = (
      <UsuarioView
        username={user}
        grupos={grupos}
        onPerfilClick={handleNavigateToEditProfile}
      />
    );
  } else {
    content = <p>Rol desconocido</p>;
  }

  return <div>{content}</div>;
}

export default App;