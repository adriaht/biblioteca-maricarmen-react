// src/pages/ImprimirExemplars.jsx
import React from 'react';

function ImprimirExemplars({ items, centerName }) {
    // Chunk items into rows of 2
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }
  
    return (
      <div className="printPage">
        <table className="labelsTable">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {/* Celda 1: Nombre del centro + Código de barras */}
                    <td className="labelCell">
                      <div className="labelCenter">{centerName}</div>
                      {/* TODO: sustituye esta URL por tu propia API de generación de código de barras */}
                      <img
                        src={`https://api.example.com/barcode?data=${encodeURIComponent(item.registre)}`}
                        alt={`Barcode for ${item.registre}`}
                        className="barcodeImg"
                      />
                    </td>
                    {/* Celda 2: CDU */}
                    <td className="labelCell">
                      <div className="labelCdu">CDU: {item.cataleg?.CDU}</div>
                    </td>
                  </React.Fragment>
                ))}
                {/* Si fila impar, rellenar celdas vacías */}
                {row.length < 2 && (
                  <>
                    <td className="labelCell emptyCell" />
                    <td className="labelCell emptyCell" />
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default ImprimirExemplars;