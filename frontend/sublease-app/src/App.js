import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ApartmentDetails from './components/ApartmentDetails';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Home />
      <Container>
        <Routes>
          <Route path="/" exact component={Home} />
          <Route path="/details/:id" component={ApartmentDetails} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;