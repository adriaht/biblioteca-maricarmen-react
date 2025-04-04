// src/pages/Perfil.jsx
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
function Perfil({ username, onBack }) {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState("");
  
    console.log("Cargando perfil de:", username);
  
    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/perfil/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // envío en el body
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al cargar perfil");
          }
          return res.json();
        })
        .then((data) => setProfileData(data))
        .catch((err) => setError(err.message));
    }, [username]);
  
    if (error) {
      return (
        <div>
          <Paragraph style={{ color: "red" }}>{error}</Paragraph>
          <Button text="Volver" onClick={onBack} />
        </div>
      );
    }
  
    if (!profileData) {
      return <Paragraph>Cargando perfil...</Paragraph>;
    }
  
    return (
      <div>
        <Header level={2}>Perfil de {profileData.username}</Header>
        <Paragraph>
          {profileData.imatge ? (
            <img
              src={`http://127.0.0.1:8000${profileData.imatge}`}
              alt="Foto de perfil"
              style={{ width: "150px", borderRadius: "50%" }}
            />
          ) : (
            "Sin imagen"
          )}
        </Paragraph>
        <Paragraph>Nombre: {profileData.nombre}</Paragraph>
        <Paragraph>Email: {profileData.email}</Paragraph>
        <Paragraph>Grupos: {profileData.grupos.join(", ")}</Paragraph>
        <Paragraph>Centro: {profileData.centre || "No especificado"}</Paragraph>
        <Paragraph>Ciclo: {profileData.cicle || "No especificado"}</Paragraph>
        <Paragraph>Teléfono: {profileData.telefon || "No especificado"}</Paragraph>
  
        <Button text="Volver" onClick={onBack} />
      </div>
    );
  }
  
export default Perfil;
