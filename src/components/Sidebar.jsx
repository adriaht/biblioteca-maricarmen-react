import React from "react";
import Button from "./Button";

function Sidebar({ onPerfilClick, style, ...others }) {
  return (
    <div
    style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "120px",
        height: "auto",
        backgroundColor: "#f0f0f0",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 999,
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