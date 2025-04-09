import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SearchBox({ books, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filteredBooks = books
        .filter(book => 
          book.titol.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (book.autor && book.autor.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 5); // Limitar a 5 resultados
      
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
      // Llamar a la función onSearch con el término de búsqueda
      onSearch(searchTerm);
      setShowResults(false); // Ocultar los resultados desplegables
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = () => {
    setShowResults(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cercar llibres per titol o autor..."
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
              <Link 
                to={`/book/${book.id}`} 
                key={book.id}
                className="search-result-item"
                onClick={handleItemClick}
              >
                <div className="search-result-title">{book.titol}</div>
                <div className="search-result-author">{book.autor || "Autor desconegut"}</div>
              </Link>
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