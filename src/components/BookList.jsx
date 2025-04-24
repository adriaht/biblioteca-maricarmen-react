import { useEffect, useState } from 'react';
import BookItem from './BookItem';
import SearchBox from './SearchBox';
import imgReact from '../assets/esteve_terradas.jpeg';

function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [exemplars, setExemplars] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const [resBooks, resExemplars] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/llibres'),
        fetch('http://127.0.0.1:8000/api/exemplars')
      ]);

      if (!resBooks.ok || !resExemplars.ok) throw new Error("Error en la carga");

      const booksData = await resBooks.json();
      const exemplarsData = await resExemplars.json();

      setBooks(booksData);
      setDisplayedBooks(booksData);
      setExemplars(exemplarsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term || term.trim() === '') {
      setDisplayedBooks(books);
      setSearchActive(false);
      return;
    }
    const filtered = books.filter(book =>
      book.titol.toLowerCase().includes(term.toLowerCase()) ||
      (book.autor && book.autor.toLowerCase().includes(term.toLowerCase()))
    );
    setDisplayedBooks(filtered);
    setSearchActive(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDisplayedBooks(books);
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

      {!loading && (
        <SearchBox 
          books={books}
          onSearch={handleSearch}
          onSelectBook={onSelectBook}
        />
      )}

      <div className="books-section">
        {searchActive && (
          <div className="search-status">
            <h2 className='h2'>Resultats per: "{searchTerm}"</h2>
            <button onClick={clearSearch} className="clear-search-btn">
              Mostrar tots els llibres
            </button>
          </div>
        )}
        {!searchActive && <h2 className='h2'>Llistat de llibres</h2>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregant llibres...</p>
          </div>
        ) : displayedBooks.length > 0 ? (
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
        ) : (
          <div className="no-books-container">
            <p className="no-books-message">
              No s'han trobat llibres que coincideixin amb la teva cerca.
            </p>
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