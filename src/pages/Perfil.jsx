import { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import LabelInput from "../components/LabelInput";

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
        console.log(data.imatge);
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
    <div className="perfil" style={{ width: "700px" }}>
      <Header level={2}>Editar perfil de {profileData.username}</Header>

      {profileData.imatge ? (
        <img
          src={`http://127.0.0.1:8000${profileData.imatge}`}
          alt="Imagen de perfil"
          width="100px"
          height="100px"
          style={{
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      ) : (
        <p>No hay imagen de perfil</p>
      )}

      <LabelInput
        label="Nombre:"
        name="nombre"
        type="text"
        value={formData.nombre || ""}
        onChange={handleChange}
      />

      <LabelInput
        label="Email:"
        name="email"
        type="email"
        value={formData.email || ""}
        onChange={handleChange}
      />

      <LabelInput
        label="Centro:"
        name="centre"
        type="text"
        value={formData.centre || ""}
        onChange={handleChange}
      />

      <LabelInput
        label="Ciclo:"
        name="cicle"
        type="text"
        value={formData.cicle || ""}
        onChange={handleChange}
      />

      <LabelInput
        label="Teléfono:"
        name="telefon"
        type="tel"
        value={formData.telefon || ""}
        onChange={handleChange}
      />

      {message && <Paragraph>{message}</Paragraph>}

      <Button text="Guardar cambios" onClick={handleSave} />
      <Button text="Volver" onClick={onBack} />
    </div>
  );
}

export default Perfil;
