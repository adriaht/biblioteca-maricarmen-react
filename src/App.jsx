import { useState } from 'react';
import './App.css';
import BookList from './components/BookList';
import './styles.css';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <BookList />
      <Login/>
    </div>
  );
}

export default App;
