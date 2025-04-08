import { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

function Perfil({ username, onBack }) {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/perfil/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar perfil");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setFormData(data);
      })
      .catch((err) => setError(err.message));
  }, [username]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setMessage("");
    const res = await fetch("http://127.0.0.1:8000/api/verificar-cambios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.modified) {
      await fetch("http://127.0.0.1:8000/api/perfil/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setMessage("Perfil actualizado correctamente.");
    } else {
      setMessage("No hay cambios para guardar.");
    }
  };

  if (error) {
    return (
      <div>
        <Paragraph style={{ color: "red" }}>{error}</Paragraph>
        <Button text="Volver" onClick={onBack} />
      </div>
    );
  }

  if (!profileData) return <Paragraph>Cargando perfil...</Paragraph>;

  return (
    <div>
      <Header level={2}>Editar perfil de {profileData.username}</Header>

      <label>Nombre:</label>
      <input name="nombre" value={formData.nombre || ""} onChange={handleChange} />

      <label>Email:</label>
      <input name="email" value={formData.email || ""} onChange={handleChange} />

      <label>Centro:</label>
      <input name="centre" value={formData.centre || ""} onChange={handleChange} />

      <label>Ciclo:</label>
      <input name="cicle" value={formData.cicle || ""} onChange={handleChange} />

      <label>Teléfono:</label>
      <input name="telefon" value={formData.telefon || ""} onChange={handleChange} />

      {message && <Paragraph>{message}</Paragraph>}

      <Button text="Guardar cambios" onClick={handleSave} />
      <Button text="Volver" onClick={onBack} />
    </div>
  );
}

export default Perfil;
