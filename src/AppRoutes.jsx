// AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import Login from "./pages/Login";
import CsvUpload from "./components/CsvUpload";
import Navbar from './components/Navbar';

function AppRoutes({ isAuthenticated, onLoginSuccess }) {
  return (
    <Router>
    <div className="App">
      <Navbar />
      <div className="app-content">
        <Routes>
          
          <Route path="/" element={<BookList />} />
          <Route
            path="/login"
            element={
              isAuthenticated ?
              <Navigate to="/" /> :
              <Login onLoginSuccess={handleLoginSuccess} />
            }
          />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/csv-upload" element={<CsvUpload />} /> {/* Nueva ruta para CsvUpload */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default AppRoutes;
