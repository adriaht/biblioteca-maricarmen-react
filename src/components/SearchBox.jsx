import { useState, useEffect } from 'react';

function SearchBox({ books, onSearch, onSelectBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Buscar resultados en tiempo real solo cuando tenemos libros cargados
  useEffect(() => {
    if (searchTerm.length >= 3 && books && books.length > 0) {
      // Filtramos los libros que coincidan con el término de búsqueda
      const filteredBooks = books
        .filter(book => 
          book.titol.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (book.autor && book.autor.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 5); // Limitamos a 5 resultados
      
      setSearchResults(filteredBooks);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, books]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.length >= 3) {
      onSearch(searchTerm);
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (bookId) => {
    onSelectBook(bookId);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cercar llibres per títol o autor..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input search-box-color"
        />
        <button type="submit" className="search-button">
          Cercar
        </button>
      </form>
      
      {showResults && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(book => (
              <div 
                key={book.id}
                className="search-result-item"
                onClick={() => handleItemClick(book.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="search-result-title">{book.titol}</div>
                <div className="search-result-author">{book.autor || "Autor desconegut"}</div>
              </div>
            ))
          ) : (
            <div className="no-results">No s'han trobat resultats</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;