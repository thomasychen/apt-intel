import React, { useState } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Box, FormControl, InputLabel, Select, MenuItem,
  Button, Menu, Slider, TextField, FormControlLabel, Checkbox
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState([0, 5]);
  const [baths, setBaths] = useState([0, 5]);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(100000);
  const [furnished, setFurnished] = useState(false);
  const [apartmentType, setApartmentType] = useState('');
  const [bedBathAnchorEl, setBedBathAnchorEl] = useState(null);
  const [costAnchorEl, setCostAnchorEl] = useState(null);

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
    try {
      const response = await axios.get('http://localhost:8080/apartments', {
        params: {
          bed_min: beds[0],
          bed_max: beds[1],
          bath_min: baths[0],
          bath_max: baths[1],
          cost_min: minCost,
          cost_max: maxCost,
          city: location,
          furnished: furnished,
          shared: apartmentType,
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
          Apartment Intelligence
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', ml: 3 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Location</InputLabel>
            <Select value={location} onChange={handleLocationChange} label="Location">
              <MenuItem value="Berkeley, California">Berkeley, California</MenuItem>
              <MenuItem value="Location 2">Location 2</MenuItem>
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
  );
};

export default Navbar;
