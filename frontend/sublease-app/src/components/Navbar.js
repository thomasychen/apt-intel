import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Checkbox, FormControlLabel, Box, OutlinedInput, Button, Menu, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState([0, 5]);
  const [baths, setBaths] = useState([0, 5]);
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
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
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="location1">Location 1</MenuItem>
              <MenuItem value="location2">Location 2</MenuItem>
              <MenuItem value="location3">Location 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Beds & Baths</InputLabel>
            <Button
              aria-controls="bed-bath-menu"
              aria-haspopup="true"
              onClick={handleBedBathClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ textTransform: 'none', border: '1px solid #e0e0e0', borderRadius: 1, minWidth: 120 }}
            >
              Beds & Baths
            </Button>
            <Menu
              id="bed-bath-menu"
              anchorEl={bedBathAnchorEl}
              keepMounted
              open={Boolean(bedBathAnchorEl)}
              onClose={handleBedBathClose}
              PaperProps={{ style: { padding: '10px' } }}
            >
              <Typography variant="caption">Beds</Typography>
              <Slider
                value={beds}
                onChange={handleBedsChange}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                sx={{ width: 200 }}
              />
              <Typography variant="caption">Baths</Typography>
              <Slider
                value={baths}
                onChange={handleBathsChange}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                sx={{ width: 200 }}
              />
            </Menu>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Cost</InputLabel>
            <Button
              aria-controls="cost-menu"
              aria-haspopup="true"
              onClick={handleCostClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ textTransform: 'none', border: '1px solid #e0e0e0', borderRadius: 1, minWidth: 120 }}
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
            sx={{ marginLeft: 0 }}
          />
          <Button variant="contained" sx={{ backgroundColor: '#007BFF', textTransform: 'none' }}>Save Search</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
