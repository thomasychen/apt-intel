import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';

const ApartmentDetails = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/apartments/${id}`)
      .then(response => response.json())
      .then(data => setApartment(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  if (!apartment) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">{apartment.title}</Typography>
      <img src={apartment.image} alt={apartment.title} style={{ width: '100%', height: 'auto', marginTop: '16px' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>Description</Typography>
      <Typography>{apartment.description}</Typography>
      {/* Add more details as needed */}
    </Container>
  );
};

export default ApartmentDetails;
