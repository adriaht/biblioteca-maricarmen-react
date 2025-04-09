import { useEffect, useState } from 'react';
import { getBooks, searchBooks } from '../services/api';
import BookItem from './BookItem';
import SearchBox from './SearchBox';
import imgReact from '../assets/esteve_terradas.jpeg';

function BookList() {
  const [books, setBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Cargar todos los libros al iniciar
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
      setDisplayedBooks(data); // Inicialmente mostrar todos los libros
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setLoading(true);
    
    if (!term || term.trim() === '') {
      // Si el término de búsqueda está vacío, mostrar todos los libros
      setDisplayedBooks(books);
      setSearchActive(false);
      setLoading(false);
      return;
    }

    // Filtrar los libros según el término de búsqueda
    const filtered = books.filter(book => 
      book.titol.toLowerCase().includes(term.toLowerCase()) || 
      (book.autor && book.autor.toLowerCase().includes(term.toLowerCase()))
    );
    
    setDisplayedBooks(filtered);
    setSearchActive(true);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedBooks(books);
    setSearchActive(false);
  };

  return (
    <div className="container">
      <div className="header">
        <img src={imgReact} alt="React Logo" className="logo" />
        <h1>Biblioteca Mari Carmen Brito</h1>
      </div>
      
      {/* Buscador con capacidad de búsqueda */}
      {!loading && <SearchBox books={books} onSearch={handleSearch} />}
      
      <div className="books-section">
        {searchActive && (
          <div className="search-status">
            <h2>Resultats per: "{searchTerm}"</h2>
            <button onClick={clearSearch} className="clear-search-btn">
              Mostrar tots els llibres
            </button>
          </div>
        )}
        
        {!searchActive && (
          <h2>Llistat de llibres</h2>
        )}
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregant llibres...</p>
          </div>
        ) : displayedBooks.length > 0 ? (
          <ul className="books-grid">
            {displayedBooks.map((book) => (
              <li key={book.id} className="book-item">
                <BookItem book={book} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-books-container">
            <p className="no-books-message">No s'han trobat llibres que coincideixin amb la teva cerca.</p>
            {searchActive && (
              <button onClick={clearSearch} className="clear-search-btn">
                Mostrar tots els llibres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;