// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import Login from "./pages/Login";
import CsvUpload from "./components/CsvUpload";

function AppRoutes({ isAuthenticated, onLoginSuccess }) {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLoginSuccess={onLoginSuccess} />
        }
      />
      <Route path="/book/:id" element={<BookDetails />} />
      <Route path="/csv-upload" element={<CsvUpload />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
