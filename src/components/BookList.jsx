import { useEffect, useState } from 'react';
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
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/llibres');
      if (!response.ok) throw new Error('No se pudo obtener la lista de libros');
      const data = await response.json();
      setBooks(data);
      setDisplayedBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setLoading(true);

    if (!term || term.trim() === '') {
      setDisplayedBooks(books);
      setSearchActive(false);
      setLoading(false);
      return;
    }

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
        <h1 className='h1'>Biblioteca Mari Carmen Brito</h1>
      </div>

      {!loading && <SearchBox books={books} onSearch={handleSearch} />}

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
