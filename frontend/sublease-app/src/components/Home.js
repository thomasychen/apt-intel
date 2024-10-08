import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { FilterContext } from '../contexts/FilterContext';
import {
  Grid, Card, CardContent, Typography, CardActionArea, FormControl, InputLabel, Select, MenuItem,
  Button, Menu, Slider, TextField, FormControlLabel, Checkbox, Box, AppBar, Toolbar
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Home = () => {
  const { 
    location, setLocation,
    beds, setBeds,
    baths, setBaths,
    minCost, setMinCost,
    maxCost, setMaxCost,
    furnished, setFurnished,
    apartmentType, setApartmentType,
    startDate, setStartDate,
    endDate, setEndDate
  } = useContext(FilterContext);
  
  const [apartments, setApartments] = useState([]);
  const [bedBathAnchorEl, setBedBathAnchorEl] = useState(null);
  const [costAnchorEl, setCostAnchorEl] = useState(null);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/apartments', {
        params: {
          bed_min: beds[0],
          bed_max: beds[1],
          bath_min: baths[0],
          bath_max: baths[1],
          cost_min: minCost,
          cost_max: maxCost,
          city: location.split(",")[0].trim(),
          state: location.split(",")[1].trim(),
          furnished: furnished,
          shared: apartmentType,
          start_date: startDate ? startDate.toISOString().split('T')[0] : '',
          end_date: endDate ? endDate.toISOString().split('T')[0] : '',
        }
      });
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleBedsChange = (event, newValue) => {
    setBeds(newValue);
  };

  const handleBathsChange = (event, newValue) => {
    setBaths(newValue);
  };

  const handleMinCostChange = (event) => {
    setMinCost(event.target.value);
  };

  const handleMaxCostChange = (event) => {
    setMaxCost(event.target.value);
  };

  const handleFurnishedChange = (event) => {
    setFurnished(event.target.checked);
  };

  const handleApartmentTypeChange = (event) => {
    setApartmentType(event.target.value);
  };

  const handleBedBathClick = (event) => {
    setBedBathAnchorEl(event.currentTarget);
  };

  const handleBedBathClose = () => {
    setBedBathAnchorEl(null);
  };

  const handleCostClick = (event) => {
    setCostAnchorEl(event.currentTarget);
  };

  const handleCostClose = () => {
    setCostAnchorEl(null);
  };

  const handleUpdateSearch = async () => {
    fetchApartments();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: '1200px', ml: 3 }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Location</InputLabel>
                <Select value={location} onChange={handleLocationChange} label="Location">
                  <MenuItem value="Berkeley, California">Berkeley, California</MenuItem>
                  <MenuItem value="Seattle, Washington">Seattle, Washington</MenuItem>
                  <MenuItem value="Location 3">Location 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <Button
                  aria-controls="bed-bath-menu"
                  aria-haspopup="true"
                  onClick={handleBedBathClick}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ textTransform: 'none', color: 'black', border: '1px solid #e0e0e0', borderRadius: 1, minWidth: 120 }}
                >
                  Beds & Baths
                </Button>
                <Menu
                  id="bed-bath-menu"
                  anchorEl={bedBathAnchorEl}
                  keepMounted
                  open={Boolean(bedBathAnchorEl)}
                  onClose={handleBedBathClose}
                  PaperProps={{ style: { padding: '25px' } }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="caption" sx={{ marginBottom: 1 }}>Beds</Typography>
                    <Slider
                      value={beds}
                      onChange={handleBedsChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                      sx={{ width: 200 }}
                    />
                    <Typography variant="caption" sx={{ marginTop: 2, marginBottom: 1 }}>Baths</Typography>
                    <Slider
                      value={baths}
                      onChange={handleBathsChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                      sx={{ width: 200 }}
                    />
                  </Box>
                </Menu>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <Button
                  aria-controls="cost-menu"
                  aria-haspopup="true"
                  onClick={handleCostClick}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ textTransform: 'none', color: 'rgba(0,0,0,0.87)', border: '1px solid #e0e0e0', borderRadius: 1, minWidth: 120 }}
                >
                  Cost
                </Button>
                <Menu
                  id="cost-menu"
                  anchorEl={costAnchorEl}
                  keepMounted
                  open={Boolean(costAnchorEl)}
                  onClose={handleCostClose}
                  PaperProps={{ style: { padding: '10px' } }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Min Cost"
                      value={minCost}
                      onChange={handleMinCostChange}
                      size="small"
                      variant="outlined"
                    />
                    <TextField
                      label="Max Cost"
                      value={maxCost}
                      onChange={handleMaxCostChange}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Menu>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Single/Shared</InputLabel>
                <Select value={apartmentType} onChange={handleApartmentTypeChange} label="Single/Shared">
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="shared">Shared</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={furnished} onChange={handleFurnishedChange} />}
                label="Furnished"
                sx={{ color: 'black', marginLeft: 0 }}
              />
              <Button variant="contained" sx={{ backgroundColor: '#007BFF', textTransform: 'none' }} onClick={handleUpdateSearch}>
                Update Search
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Grid container spacing={4} sx={{ mt: 2, px: 2, maxWidth: '1200px', margin: '0 auto' }}>
          {apartments.map((apt) => {
            const title = `${apt.shared ? 'Shared' : 'Private'} ${apt.bed} beds ${apt.bath} bath ${apt.furnished ? 'Furnished' : ''}`;
            const subtext = `Gender preference: ${apt.gender === 0 ? 'No preference' : apt.gender === 1 ? 'Male only' : 'Female only'}, ${apt.parking ? 'Parking available' : 'No parking'}`;
            const cost = `$${apt.cost}/mo`;
            const dates = `${apt.start_date} - ${apt.end_date}`;

            return (
              <Grid item key={apt.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardActionArea component={Link} to={`/details/${apt.city}/${apt.id}`}>
                    <Carousel showThumbs={false} infiniteLoop useKeyboardArrows dynamicHeight>
                      {apt.image_urls.map((url, index) => (
                        <div key={index}>
                          <img src={url} alt={`Apartment ${index + 1}`} style={{ height: '300px', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </Carousel>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subtext}
                      </Typography>
                      <Typography variant="body2" color="text.primary" style={{ fontWeight: 'bold' }}>
                        {cost}
                      </Typography>
                      <Typography variant="body2" color="text.primary" style={{ fontWeight: 'bold' }}>
                        {dates}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </LocalizationProvider>
  );
};

export default Home;
