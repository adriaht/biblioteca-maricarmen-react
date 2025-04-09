function BookItem({ book }) {
  return (
    <div className="book-card">
      <h3>{book.titol}</h3>
      <p>
        <strong>Autor:</strong> ???
      </p>
    </div>
  );
}

export default BookItem;
