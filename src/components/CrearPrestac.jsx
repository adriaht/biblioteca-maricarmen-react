import { useState, useEffect } from "react";
import LabelInput from "./LabelInput";
import Button from "./Button";

function CrearPrestac({ bookId, bookTitle, onBack }) {
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
        setMessage("Si us plau, completa tots els camps");
        return;
    }

    const selectedDate = new Date(reservaFecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reseteamos la hora

    if (selectedDate < today) {
        setMessage("La data no pot ser anterior al dia actual");
        return;
    }

    try {
        setLoading(prev => ({ ...prev, creating: true }));
        setMessage("Creant préstec...");

        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error('Token no disponible. Inicia sessió.');
        }

       
       const response = await fetch("https://biblioteca5.ieti.site/api/crear_prestec", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
           
            },
            body: JSON.stringify({
              usuari: selectedUser.id,
              exemplar: selectedExemplar.id,
            }),
            
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en crear el préstec");
        }

        setMessage("✅ Préstec creat correctament");
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

      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("Sessió no iniciada. Si us plau inicia sessió.");
        return;
      }

      try {
        setLoading(prev => ({ ...prev, users: true }));

        const response = await fetch("https://biblioteca5.ieti.site/api/buscar_usuarios/", {
          method: "POST",
          headers: {
            //"Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: search.trim() })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error Response:", errorData);
          setMessage("Error en cercar l'usuari"); 
          return;
        }

        

        const user = await response.json();
        setFilteredUsers(user);
        setMessage("");
      } catch (error) {
        console.error("Error en cercar l'usuari:", error);
        setFilteredUsers([]);
        setMessage("Usuari no trobat");
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
        setMessage(`Error en carregar exemplars: ${error.message}`);
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
    <div className="container-books">
      <div className="max-w-2xl mt-10 mx-auto p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-center text-white py-3 rounded-md shadow"
        style={{ backgroundColor: 'rgba(59, 130, 246, 0.5)' }}
      >
        Crear préstec 
      </h3>
      <h2
        className="text-lg font-semibold mb-6 text-center text-blue-500 bg-white border border-blue-500 py-2 rounded-md shadow"
      >
        {bookTitle}
      </h2>



        {/* Buscador de usuarios */}
        <div className="mb-6">
          <LabelInput
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca usuari..."
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Lista de usuarios */}
        {loading.users ? (
          <p>Carregant usuaris...</p>
        ) : (
          filteredUsers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Usuaris:</h2>
              <div className="max-h-60 overflow-y-auto border rounded">
                {filteredUsers.map(u => (
                  <div
                  key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3 hover:bg-gray-100 cursor-pointer ${
                      selectedUser?.id === u.id
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
            <p className="font-semibold">Usuaris seleccionats:</p>
            <p>{selectedUser.first_name} {selectedUser.last_name} - {selectedUser.email}</p>
            <p>Telèfon: {selectedUser.telefon}</p>
            {selectedUser.centre && <p>Centra: {selectedUser.centre}</p>}
          </div>

          <div className="mb-6 relative z-10">
              <label className="block text-lg font-semibold mb-2">Data de préstec:</label>
              <input
                type="date"
                value={reservaFecha}
                onChange={(e) => setReservaFecha(e.target.value)}
                className="w-full p-2 border rounded"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>



            {/* Ejemplares y fecha */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Exemplars disponibles:</h2>
              {loading.exemplars ? (
                <p>Carregant exemplars...</p>
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
                      <p>Registre: {e.registre}</p>
                      {e.centre && <p className="text-sm">Centre: {e.centre.nom}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">No hi ha exemplars disponibles</p>
              )}
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
      </div>
    </>
    
  );
}

export default CrearPrestac;
