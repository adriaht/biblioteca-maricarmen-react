import React from "react";
import Button from "./Button";

function Sidebar({ onPerfilClick, style, ...others }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100px",
        height: "auto",
        backgroundColor: "#f0f0f0",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
        padding: "1rem",
        ...style,
      }}
      {...others}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button text="☰ Perfil" onClick={onPerfilClick} />
      </div>
      {/* Aquí puedes añadir más opciones del sidebar si lo deseas */}
    </div>
  );
}

export default Sidebar;