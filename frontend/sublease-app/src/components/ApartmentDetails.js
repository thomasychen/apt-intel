import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography, Container, Button, Box, IconButton, Table, TableBody, TableCell, TableRow, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton component={Link} to="/" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{apartment.shared ? 'Shared' : 'Private'} {apartment.bed} beds {apartment.bath} bath {apartment.furnished ? 'Furnished' : ''}</Typography>
      </Box>
      <Carousel showThumbs={false} infiniteLoop useKeyboardArrows dynamicHeight>
        {apartment.image_urls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Apartment ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Carousel>
      <Box sx={{ display: 'flex', mt: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mt: 2 }}>Description</Typography>
          <Typography>{apartment.description}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Features</Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>{apartment.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cost</TableCell>
                  <TableCell>${apartment.cost}/mo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Parking</TableCell>
                  <TableCell>{apartment.parking ? 'Available' : 'Not available'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender Preference</TableCell>
                  <TableCell>{apartment.gender === 0 ? 'No preference' : apartment.gender === 1 ? 'Male only' : 'Female only'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Furnished</TableCell>
                  <TableCell>{apartment.furnished ? 'Yes' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Start Date</TableCell>
                  <TableCell>{apartment.start_date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>End Date</TableCell>
                  <TableCell>{apartment.end_date}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>
        <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => window.open(apartment.url, '_blank')}
          >
            View Listing
          </Button>
          <Typography variant="caption">You must be in the group to view the listing</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentDetails;

