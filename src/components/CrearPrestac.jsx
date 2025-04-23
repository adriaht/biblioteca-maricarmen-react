import { useState, useEffect } from "react";
import LabelInput from "./LabelInput";
import Button from "./Button";

function CrearPrestac({ bookId, onBack }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [exemplars, setExemplars] = useState([]);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [message, setMessage] = useState("");
  const [reservaFecha, setReservaFecha] = useState("");
  const [loading, setLoading] = useState({
    users: false,
    exemplars: false,
    creating: false
  });

  // Función para crear el préstamo
  const handleCrearPrestac = async () => {
    if (!selectedUser || !selectedExemplar || !reservaFecha) {
      setMessage("Por favor, completa todos los campos");
      return;
    }

    const selectedDate = new Date(reservaFecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reseteamos la hora

    if (selectedDate < today) {
      setMessage("La fecha no puede ser anterior al día actual");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, creating: true }));
      setMessage("Creando préstamo...");

      const token = localStorage.getItem("authToken");
      const response = await fetch("https://biblioteca5.ieti.site/api/reserves/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          usuari: selectedUser.id,
          exemplar: selectedExemplar.id,
          data_reserva: reservaFecha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el préstamo");
      }

      setMessage("✅ Préstamo creado correctamente");
      setSelectedExemplar(null);
      setReservaFecha("");
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  // Buscar usuario cuando se ingresa texto en el campo de búsqueda
  useEffect(() => {
    const buscarUsuario = async () => {
      if (!search.trim()) {
        setFilteredUsers([]);
        setMessage("");
        return;
      }

      try {
        setLoading(prev => ({ ...prev, users: true }));
        const token = localStorage.getItem("authToken");

        const response = await fetch("https://biblioteca5.ieti.site/api/perfil/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username: search.trim() })
        });

        if (!response.ok) throw new Error("No se encontró el usuario");

        const user = await response.json();
        setFilteredUsers([user]);
        setMessage("");
      } catch (error) {
        console.error("Error al buscar usuario:", error);
        setFilteredUsers([]);
        setMessage("Usuario no encontrado");
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    buscarUsuario();
  }, [search]);

  // Buscar ejemplares del libro
  useEffect(() => {
    if (!bookId) return;

    const fetchExemplars = async () => {
      setLoading(prev => ({ ...prev, exemplars: true }));
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("https://biblioteca5.ieti.site/api/exemplars/", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        const disponibles = data.filter(
          e => e.cataleg?.id === parseInt(bookId) && !e.baixa && !e.exclos_prestec
        );
        setExemplars(disponibles);
      } catch (error) {
        console.error("Error:", error);
        setMessage(`Error al cargar ejemplares: ${error.message}`);
      } finally {
        setLoading(prev => ({ ...prev, exemplars: false }));
      }
    };
    fetchExemplars();
  }, [bookId]);

  useEffect(() => {
    setSelectedUser(null);
  }, [search]);

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear préstamo</h1>

        {/* Buscador de usuarios */}
        <div className="mb-6">
          <LabelInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Lista de usuarios */}
        {loading.users ? (
          <p>Cargando usuarios...</p>
        ) : (
          filteredUsers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Usuarios:</h2>
              <div className="max-h-60 overflow-y-auto border rounded">
                {filteredUsers.map(u => (
                  <div
                    key={u.username}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3 hover:bg-gray-100 cursor-pointer ${
                      selectedUser?.username === u.username
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <p className="font-medium">{u.first_name} {u.last_name}</p>
                    <p className="text-sm text-gray-600">{u.username} | {u.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {selectedUser && (
          <>
            <div className="mb-4 p-2 border rounded bg-blue-50">
              <p className="font-semibold">Usuario seleccionado:</p>
              <p>{selectedUser.first_name} {selectedUser.last_name} - {selectedUser.email}</p>
            </div>

            {/* Ejemplares y fecha */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ejemplares disponibles:</h2>
              {loading.exemplars ? (
                <p>Cargando ejemplares...</p>
              ) : exemplars.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {exemplars.map(e => (
                    <div
                      key={e.id}
                      onClick={() => setSelectedExemplar(e)}
                      className={`p-3 border rounded cursor-pointer ${
                        selectedExemplar?.id === e.id
                          ? "bg-green-50 border-green-500"
                          : ""
                      }`}
                    >
                      <p>Registro: {e.registre}</p>
                      {e.centre && <p className="text-sm">Centro: {e.centre.nom}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">No hay ejemplares disponibles</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Fecha de préstamo:</label>
              <input
                type="date"
                value={reservaFecha}
                onChange={(e) => setReservaFecha(e.target.value)}
                className="w-full p-2 border rounded"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                text={loading.creating ? "Creando..." : "Confirmar préstamo"}
                onClick={handleCrearPrestac}
                disabled={!selectedExemplar || !reservaFecha || loading.creating}
                className={`${
                  !selectedExemplar || !reservaFecha
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded`}
              />
              <Button
                text="Volver"
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              />
            </div>
          </>
        )}

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
}

export default CrearPrestac;
