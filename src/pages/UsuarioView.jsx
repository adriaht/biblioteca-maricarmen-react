import React from "react";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";

function UsuariView({ username, grupos, goToPerfil }) {
    return (
      <div>
        <Sidebar onPerfilClick={goToPerfil} />
        <Header level={2}>Hola, {username} (Usuari)</Header>
        <Paragraph>Grupos: {grupos.join(", ")}</Paragraph>
      </div>
    );
  }
  
  export default UsuariView;