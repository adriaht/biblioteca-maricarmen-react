import React from "react";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";

function BibliotecarioView({ username, grupos, goToPerfil, goToCatalag }) {
    return (
        <div>
         
            <Header level={2}>Panel del Bibliotecario</Header>
            <Paragraph>Bienvenido/a, {username}. Tienes privilegios de edición.</Paragraph>
            <Paragraph>Grupos: {grupos.join(", ")}</Paragraph>
            {/* Aquí podrías añadir botones para gestionar libros, usuarios, etc. */}
        </div>
    );
}

export default BibliotecarioView;