import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Libro from './pages/Libro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Libro />} />
      </Routes>
    </Router>
  );
}

export default App;
