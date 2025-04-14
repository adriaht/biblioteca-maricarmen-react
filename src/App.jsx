import { useState } from 'react';
import './App.css';
import BookList from './components/BookList';
import './styles.css';
import gifBanner from './assets/gifP3.gif';

function App() {
  return (
    <div className="App">
      <BookList />
      <a href="https://www.iesesteveterradas.cat/" target="_blank" rel="noopener noreferrer">
        <img src={gifBanner} alt="GIF de final de página" className="gif-banner" />
      </a>
    </div>
  );
}

export default App;
