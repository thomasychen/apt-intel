import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [location, setLocation] = useState(',');
  const [beds, setBeds] = useState([0, 5]);
  const [baths, setBaths] = useState([0, 5]);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(100000);
  const [furnished, setFurnished] = useState(true);
  const [apartmentType, setApartmentType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <FilterContext.Provider value={{
      location, setLocation,
      beds, setBeds,
      baths, setBaths,
      minCost, setMinCost,
      maxCost, setMaxCost,
      furnished, setFurnished,
      apartmentType, setApartmentType,
      startDate, setStartDate,
      endDate, setEndDate
    }}>
      {children}
    </FilterContext.Provider>
  );
};