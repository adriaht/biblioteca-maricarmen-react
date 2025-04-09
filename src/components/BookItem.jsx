import { Link } from 'react-router-dom';

function BookItem({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="book-link">
      <div className="book-card">
        <h3 className="book-title">
          {book.titol}
        </h3>
        
        <div className="book-info">
          <p className="book-author">
            <span>Autor:</span> {book.autor || "No especificado"}
          </p>
          
          {book.editorial && (
            <p className="book-editorial">
              <span>Editorial:</span> {book.editorial}
            </p>
          )}
          
          {book.ISBN && (
            <p className="book-isbn">
              <span>ISBN:</span> {book.ISBN}
            </p>
          )}
        </div>
        
        <button className="view-details-btn">
          Veure detalls
        </button>
      </div>
    </Link>
  );
}

export default BookItem;