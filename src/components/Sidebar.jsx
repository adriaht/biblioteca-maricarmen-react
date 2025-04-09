import React from "react";
import Button from "./Button";

function Sidebar({ onLoginClick,onPerfilClick,setAuthenticated, onCatalagClick, style, isToken, setRole, ...others }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "320px",
        height: "auto",
        backgroundColor: "rgba(0,0,0,0.3)",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 999,
      }}
      {...others}
    >

      {isToken && onPerfilClick && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button text="☰ Perfil" onClick={onPerfilClick} />
          <br />
        </div>

      )}
      {isToken ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button text="Catalogo" onClick={onCatalagClick} />
        </div>
      ) : (<>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button text="Iniciar Sesión" onClick={onLoginClick} />
          
      </div>
     <div style={{ display: "flex", justifyContent: "flex-end" }}>
     <Button text="Catalogo"
       onClick={onCatalagClick} />
       
   </div>
   </>)}
      {/* Aquí puedes añadir más opciones del sidebar si lo deseas */}
    </div>
  );
}

export default Sidebar;