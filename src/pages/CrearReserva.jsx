// CrearReserva.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Paragraph from "../components/Paragraph";

function CrearReserva() {
  const { bookId } = useParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [exemplars, setExemplars] = useState([]);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [message, setMessage] = useState("");

  // Buscar usuarios
  useEffect(() => {
    fetch("https://biblioteca5.ieti.site/api/usuaris/")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredUsers(users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      (u.first_name && u.first_name.toLowerCase().includes(q)) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.telefon && u.telefon.toLowerCase().includes(q))
    ));
  }, [search, users]);

  // Buscar exemplars del libro
  useEffect(() => {
    fetch("https://biblioteca5.ieti.site/api/exemplars/")
      .then(res => res.json())
      .then(data => {
        const disponibles = data.filter(
          e => e.cataleg.id === parseInt(bookId) && !e.baixa && !e.exclos_prestec
        );
        setExemplars(disponibles);
      });
  }, [bookId]);

  const handleReserva = () => {
    if (!selectedUser || !selectedExemplar) {
      setMessage("Selecciona un usuario y un ejemplar");
      return;
    }

    fetch("https://biblioteca5.ieti.site/api/reserves/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuari: selectedUser.id,
        exemplar: selectedExemplar.id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage("Reserva creada correctamente");
      })
      .catch(() => setMessage("Error al crear la reserva"));
  };

  return (
    <div className="container">
      <h1 className="text-xl mb-4">Crear reserva</h1>

      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre, apellido, email, teléfono o username"
      />

      <h2 className="mt-4">Usuarios encontrados:</h2>
      {filteredUsers.map(u => (
        <div key={u.id} onClick={() => setSelectedUser(u)} className="cursor-pointer border p-2 my-1">
          {u.first_name} {u.last_name} ({u.username})
        </div>
      ))}

      {selectedUser && (
        <>
          <h2 className="mt-4">Ejemplares disponibles:</h2>
          {exemplars.map(e => (
            <div key={e.id} onClick={() => setSelectedExemplar(e)} className="cursor-pointer border p-2 my-1">
              {e.registre}
            </div>
          ))}
        </>
      )}

      <Button text="Confirmar reserva" onClick={handleReserva} className="mt-4" />
      {message && <Paragraph>{message}</Paragraph>}
    </div>
  );
}

export default CrearReserva;
