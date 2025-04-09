import React, { useState } from "react";

const CsvUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Por favor, selecciona un archivo.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/api/subir-documento/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Archivo procesado correctamente. Registros recibidos: ${data.registros.length}`
        );
        setErrores(data.errores || []);
      } else {
        setMessage(`❌ Error: ${data.mensaje}`);
        setErrores(data.errores || []);
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setMessage("❌ Error al subir el archivo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-200 rounded-lg shadow-md border-2 border-gray-300">
      <h2 className="text-black text-3xl font-semibold text-center mb-4">
        Subir CSV
      </h2>

      <div className="mb-4 flex w-full flex-col justify-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="bg-[#DDE1F1] text-black truncate py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-[#214093] focus:ring-opacity-50 cursor-pointer block "
        />
      </div>

      <div className="flex justify-around">
        <button
          onClick={handleUpload}
          className="bg-[#214093] text-white px-4 py-2 rounded-md border-none cursor-pointer shadow-md transition-all duration-100 ease-in-out active:bg-[#1A3379] active:translate-y-[1px] focus:outline-none"
          style={{ backgroundColor: "#214093" }}
        >
          {isLoading ? "Subiendo..." : "Subir Archivo"}
        </button>
        <button
          onClick={() => {
            setFile(null); // Limpiar el archivo
            setMessage("");
            setErrores([]);
          }}
          className="bg-[#214093] text-white px-4 py-2 rounded-md border-none cursor-pointer shadow-md transition-all duration-100 ease-in-out active:bg-[#1A3379] active:translate-y-[1px] focus:outline-none"
          style={{ backgroundColor: "#214093" }}
        >
          Cancelar
        </button>
      </div>

      <p className="mt-4 text-black whitespace-pre-wrap">{message}</p>

      {errores.length > 0 && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-2">Registros no procesados:</h3>
          <ul className="list-disc pl-5 text-sm space-y-3">
            {errores.map((err, index) => (
              <li key={index}>
                <div className="mb-1 font-medium">
                  ({index + 1}) Email: {err.fila.email} — Motivo: {err.error}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;
