// src/pages/Perfil.jsx
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

function Perfil({ username, onBack }) {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/perfil/${username}`)
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
      <Paragraph>{profileData.imatge}</Paragraph>
      <Paragraph>Nombre: {profileData.nombre}</Paragraph>
      <Paragraph>Email: {profileData.email}</Paragraph>
      <Paragraph>Grupos: {profileData.grupos.join(", ")}</Paragraph>
      <Paragraph>centro: {profileData.centre}</Paragraph>
      <Paragraph>ciclo: {profileData.cicle}</Paragraph>
      <Paragraph>telefono: {profileData.telefon}</Paragraph>
    

      
      <Button text="Volver" onClick={onBack} />
    </div>
  );
}

export default Perfil;
