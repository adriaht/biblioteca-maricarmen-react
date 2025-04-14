import React, { useState, useEffect } from "react";
import Header from "../components/Header";

function PrestacUsuario({ username }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("La pàgina de préstecs, username:", username);

  const fetchLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/prestecs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      // Ordenem els préstecs per data de retorn descendent.
      // Si data_retorn és nul, usem data_prestec com a fallback.
      const sortedLoans = data.sort((a, b) => {
        const dateA = a.data_retorn ? new Date(a.data_retorn) : new Date(a.data_prestec);
        const dateB = b.data_retorn ? new Date(b.data_retorn) : new Date(b.data_prestec);
        // Ordenació descendent: el préstec amb la data més nova (més tard) apareix primer
        return dateB - dateA;
      });

      setLoans(sortedLoans);
    } catch (err) {
      setError(err.message || "Error en obtenir els préstecs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [username]);

  // Funció per determinar l'estil de la fila segons el rang
  const getRowStyle = (loan) => {
    const today = new Date();
    const startDate = new Date(loan.data_prestec);
    // Si no hi ha data de retorn, també considerem fora de rang
    if (!loan.data_retorn) {
      return { color: "red" };
    }
    const endDate = new Date(loan.data_retorn);
    const isWithinRange = today >= startDate && today <= endDate;
    return { color: isWithinRange ? "green" : "red" };
  };

  return (
    
    <div className="container">
      <Header level={1} estilo={{ marginBottom: "20px" }}>
        Préstecs de {username}
      </Header>
      {loading && <p>Carregant...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && loans.length > 0 && (
        <table border="2" cellPadding="20" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data de préstec</th>
              <th>Data de retorn</th>
              <th>Anotacions</th>
              <th>Títol de l'exemplar</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} style={getRowStyle(loan)}>
                <td>{loan.id}</td>
                <td>{loan.data_prestec}</td>
                <td>{loan.data_retorn || "No retornat"}</td>
                <td>{loan.anotacions || "-"}</td>
                <td>{loan.exemplar_titol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && loans.length === 0 && (
        <p>No s'han trobat préstecs per a aquest usuari.</p>
      )}
    </div>
  );
}

export default PrestacUsuario;
