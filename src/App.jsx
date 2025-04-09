import React from "react";
import "./App.css";

import CsvUpload from "./components/CsvUpload"; // Importa el componente CsvUpload
import "./styles/tailwind.css"; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <div className="App">
      {/* Aquí puedes añadir el componente CsvUpload */}
      <CsvUpload />
    </div>
  );
}

export default App;
