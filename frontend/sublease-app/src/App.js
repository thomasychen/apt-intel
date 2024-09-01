import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ApartmentDetails from './components/ApartmentDetails';
import Container from '@mui/material/Container';
import { FilterProvider } from './contexts/FilterContext';

function App() {
  return (
    <FilterProvider>
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:city/:id" element={<ApartmentDetails />} />
        </Routes>
      </Container>
    </Router>
    </FilterProvider>
  );
}

export default App;