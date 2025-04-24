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
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Efecto para actualizar displayedBooks cuando cambia la página actual
  useEffect(() => {
    if (searchActive) {
      // Solo si hay una búsqueda activa, aplicamos la paginación a los resultados
      paginateBooks();
    } else {
      // Si no hay búsqueda, no mostramos libros
      setDisplayedBooks([]);
      setTotalPages(0);
    }
  }, [currentPage, books, searchActive, searchTerm]);

  // Función para paginar los libros
  const paginateBooks = () => {
    if (!searchActive) return;
    
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    
    // Filtramos según el término de búsqueda
    const dataSource = books.filter(book =>
      book.titol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.autor && book.autor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
      
    // Actualizamos el total de páginas
    setTotalPages(Math.ceil(dataSource.length / booksPerPage));
    
    // Obtenemos solo los libros de la página actual
    const paginatedData = dataSource.slice(start, end);
    setDisplayedBooks(paginatedData);
  };

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
      setExemplars(exemplarsData);
      
      // No mostramos libros inicialmente, solo los cargamos en memoria
      setDisplayedBooks([]);
      setTotalPages(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Volver a la primera página al realizar una búsqueda
    
    if (!term || term.trim() === '') {
      setSearchActive(false);
      setDisplayedBooks([]); // No mostrar libros si no hay término de búsqueda
      setTotalPages(0);
      return;
    }
    
    setSearchActive(true);
    // La paginación de los resultados de búsqueda se manejará en el useEffect
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchActive(false);
    setCurrentPage(1);
    setDisplayedBooks([]); // Limpiar libros mostrados
    setTotalPages(0);
  };

  const getTotalDisponiblesPorLibro = (bookId) => {
    return exemplars.filter(e => e.cataleg?.id === bookId && !e.baixa).length;
  };

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Volver al inicio de la página al cambiar
  };

  // Componente paginador
  const Paginator = () => {
    const pageNumbers = [];
    
    // Si hay pocas páginas, mostrar todas
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango limitado con elipsis
      if (currentPage <= 4) {
        // Caso 1: Estamos en las primeras páginas
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Caso 2: Estamos en las últimas páginas
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Caso 3: Estamos en páginas intermedias
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="pagination">
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Anterior
        </button>
        
        {pageNumbers.map((number, index) => (
          number === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={number}
              className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          )
        ))}
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente &raquo;
        </button>
      </div>
    );
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
        {searchActive ? (
          <div className="search-status">
            <h2 className='h2'>Resultados per: "{searchTerm}"</h2>
            <button onClick={clearSearch} className="clear-search-btn">
              Netejar cerca
            </button>
          </div>
        ) : (
          <div className="initial-state">
            <h2 className='h2'>Catàleg de la Biblioteca</h2>
            <p className="search-prompt">Utilitza la barra de cerca per trobar llibres per títol o autor</p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregant llibres...</p>
          </div>
        ) : searchActive && displayedBooks.length > 0 ? (
          <>
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
            
            {/* Paginador */}
            {totalPages > 1 && <Paginator />}
          </>
        ) : searchActive ? (
          <div className="no-books-container">
            <p className="no-books-message">
              No s'han trobat llibres que coincideixin amb la teva cerca.
            </p>
            <button onClick={clearSearch} className="clear-search-btn">
              Netejar cerca
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p className="empty-state-message">
              Introdueix un títol o autor per iniciar la cerca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;