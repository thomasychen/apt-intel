import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/apartments')
      .then(response => response.json())
      .then(data => setApartments(data))
      .catch(error => console.error('Error fetching data:', error));
      console.log(apartments);
  }, []);

  return (
    <Grid container spacing={4} sx={{ mt: 2 }}>
      {apartments.map((apt) => (
        <Grid item key={apt.id} xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea component={Link} to={`/details/${apt.id}`}>
              <CardMedia
                component="img"
                height="140"
                image={apt.image_urls[0]}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {apt.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;