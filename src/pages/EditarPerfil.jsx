import React, { useState, useEffect, useRef } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

function EditarPerfil({ formData, onChange, onSave, message }) {
  const [errors, setErrors] = useState({});
  const [visibleMessage, setVisibleMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ target: { name: "imatge", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const newErrors = {};

    // Validación del teléfono
    const phoneRegex = /^[0-9]*$/;
    if (formData.telefon && !phoneRegex.test(formData.telefon)) {
      newErrors.telefon = "El campo Teléfono solo puede contener números.";
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "El formato del email no es válido.";
    }

    setErrors(newErrors);
  }, [formData.telefon, formData.email]);

  // Mostrar el mensaje con timeout de 3 segundos
  useEffect(() => {
    if (message) {
      setVisibleMessage(message);
      const timeout = setTimeout(() => {
        setVisibleMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div>
      {formData.imatge ? (
        <img
          src={formData.imatge}
          alt="Imagen de perfil"
          width="100"
          height="100"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1em",
            cursor: "pointer"
          }}
          onClick={handleImageClick}
        />
      ) : (
        <p
          style={{ cursor: "pointer", marginBottom: "1em" }}
          onClick={handleImageClick}>
          No hay imagen de perfil, haz clic para agregarla
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Campo Email */}
      <LabelInput
        label="Email:"
        name="email"
        value={formData.email || ""}
        onChange={onChange}
      />
      {errors.email && (
        <Paragraph style={{ color: "red", fontSize: "0.9em" }}>
          {errors.email}
        </Paragraph>
      )}

      {/* Campo Teléfono */}
      <LabelInput
        label="Teléfono:"
        name="telefon"
        value={formData.telefon || ""}
        onChange={onChange}
      />
      {errors.telefon && (
        <Paragraph style={{ color: "red", fontSize: "0.9em" }}>
          {errors.telefon}
        </Paragraph>
      )}

      {/* Mensaje con timeout */}
      {visibleMessage && (
        <Paragraph style={{ color: "green", marginTop: "1em" }}>
          {visibleMessage}
        </Paragraph>
      )}

      <Button
        text="Guardar cambios"
        onClick={onSave}
        disabled={Object.keys(errors).length > 0}
      />
    </div>
  );
}

export default EditarPerfil;
