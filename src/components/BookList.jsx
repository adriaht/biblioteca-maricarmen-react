import { useEffect, useState } from 'react';
import BookItem from './BookItem';
import SearchBox from './SearchBox';
import imgReact from '../assets/esteve_terradas.jpeg';

function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [exemplars, setExemplars] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargamos los ejemplares para tener disponible esta información
  useEffect(() => {
    fetchExemplars();
    fetchAllBooks();
  }, []);

  const fetchExemplars = async () => {
    try {
      const resExemplars = await fetch('http://127.0.0.1:8000/api/exemplars');
      if (!resExemplars.ok) throw new Error("Error en la carga de ejemplares");
      const exemplarsData = await resExemplars.json();
      setExemplars(exemplarsData);
    } catch (error) {
      console.error("Error fetching exemplars data:", error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const resBooks = await fetch('http://127.0.0.1:8000/api/llibres');
      if (!resBooks.ok) throw new Error("Error en la carga de libros");
      const booksData = await resBooks.json();
      setBooks(booksData); // Cargamos todos los libros para el autocompletado
    } catch (error) {
      console.error("Error fetching all books data:", error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term || term.trim() === '') {
      setDisplayedBooks([]);
      setSearchActive(false);
      return;
    }

    setLoading(true);
    
    try {
      // Filtramos de los libros ya cargados
      const filtered = books.filter(book =>
        book.titol.toLowerCase().includes(term.toLowerCase()) ||
        (book.autor && book.autor.toLowerCase().includes(term.toLowerCase()))
      );
      
      setDisplayedBooks(filtered);
      setSearchActive(true);
    } catch (error) {
      console.error("Error in search:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedBooks([]);
    setSearchActive(false);
  };

  const getTotalDisponiblesPorLibro = (bookId) => {
    return exemplars.filter(e => e.cataleg?.id === bookId && !e.baixa).length;
  };

  return (
    <div className="container">
      <div className="header">
        <img src={imgReact} alt="React Logo" className="logo" />
        <h1 className='h1'>Biblioteca Maricarmen Brito</h1>
      </div>

      <SearchBox 
        books={books}
        onSearch={handleSearch}
        onSelectBook={onSelectBook}
      />

      <div className="books-section">
        {searchActive ? (
          <div className="search-status">
            <h2 className='h2'>Resultats per: "{searchTerm}"</h2>
            <button onClick={clearSearch} className="clear-search-btn">
              Nova cerca
            </button>
          </div>
        ) : (
          <div className="no-books-container" style={{ marginTop: '50px', padding: '40px 20px' }}>
            <h2 className='h2'>Cercador de llibres</h2>
            <p className="no-books-message" style={{ fontSize: '18px', marginTop: '20px' }}>
              Introdueix el títol o l'autor del llibre que cerques a la barra de cerca superior.
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregant llibres...</p>
          </div>
        ) : searchActive && displayedBooks.length > 0 ? (
          <ul className="books-grid">
            {displayedBooks.map((book) => (
              <li
                key={book.id}
                className="book-item"
                onClick={() => onSelectBook(book.id)}
                style={{ cursor: 'pointer' }}
              >
                <BookItem 
                  book={book} 
                  onSelect={onSelectBook}
                  totalExemplars={getTotalDisponiblesPorLibro(book.id)} 
                />
              </li>
            ))}
          </ul>
        ) : searchActive && displayedBooks.length === 0 ? (
          <div className="no-books-container">
            <p className="no-books-message">
              No s'han trobat llibres que coincideixin amb la teva cerca.
            </p>
            <button onClick={clearSearch} className="clear-search-btn">
              Nova cerca
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BookList;