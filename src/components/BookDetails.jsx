import { useEffect, useState } from 'react';

function BookDetails({ bookId, onBack, extraProp }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/llibres/${bookId}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener el libro');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching book details:", error);
          setError("No s'han pogut carregar els detalls del llibre.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();

    return () => controller.abort();
  }, [bookId]);

  return (
    <div className="book-details-container">
      <button onClick={onBack} className="back-btn">← Tornar a la llista</button>

      <div className="book-details-card">
        <h2 className="details-title h2">Detalls del llibre</h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargant detalls...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : book ? (
          <div className="book-info-details">
            <h3 className="book-title-details h3">{book.titol}</h3>
            <div className="book-metadata">
              <div className="metadata-item"><span>ID:</span> {book.id}</div>
              <div className="metadata-item"><span>Autor:</span> {book.autor || "No especificat"}</div>
              {book.editorial && <div className="metadata-item"><span>Editorial:</span> {book.editorial}</div>}
              {book.ISBN && <div className="metadata-item"><span>ISBN:</span> {book.ISBN}</div>}
              {book.titol_original && <div className="metadata-item"><span>Titol original:</span> {book.titol_original}</div>}
              {book.colleccio && <div className="metadata-item"><span>Colecció:</span> {book.colleccio}</div>}
              {book.data_edicio && <div className="metadata-item"><span>Fecha de edición:</span> {new Date(book.data_edicio).toLocaleDateString()}</div>}
              {book.pagines && <div className="metadata-item"><span>Páginas:</span> {book.pagines}</div>}
              {book.llengua?.nom && <div className="metadata-item"><span>Idioma:</span> {book.llengua.nom}</div>}
              {book.pais?.nom && <div className="metadata-item"><span>País:</span> {book.pais.nom}</div>}
            </div>
            {book.resum && (
              <div className="book-description">
                <h4>Resum:</h4>
                <p>{book.resum}</p>
              </div>
            )}
            {book.anotacions && (
              <div className="book-notes">
                <h4>Anotacions:</h4>
                <p>{book.anotacions}</p>
              </div>
            )}
            {book.thumbnail_url && (
              <div className="book-cover">
                <img src={book.thumbnail_url} alt={`Portada de ${book.titol}`} />
              </div>
            )}
            {book.info_url && (
              <div className="book-links">
                <a href={book.info_url} target="_blank" rel="noopener noreferrer" className="external-link">
                  Més informació
                </a>
              </div>
            )}
            {extraProp && <p className="extra-info">Prop extra: {extraProp}</p>}
          </div>
        ) : (
          <p className="error-message">No s'ha trobat informació per a aquest llibre.</p>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
