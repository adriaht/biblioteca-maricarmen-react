import React from "react";
import Button from "./Button";

function Sidebar({onCSVClick, onPrestacClick,setAuthenticated, style, isToken, setRole, ...others }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        left: 0,
        width: "220px",
        height: "auto",
        backgroundColor: "rgba(63, 94, ,0.6)",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 999,
      }}
      {...others}
    >

      {isToken && setRole==="bibliotecario" && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button text="Carga de perfils en CSV"
          onClick={onCSVClick} />
      </div>

      )}
      {isToken && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button text="Prestacs"
            onClick={onPrestacClick} />        
        </div>
      ) }
      {/* Aquí puedes añadir más opciones del sidebar si lo deseas */}
    </div>
  );
}

export default Sidebar;