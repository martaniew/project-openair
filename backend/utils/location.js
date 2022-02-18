import axios from 'axios';

const API_KEY = 'AIzaSyA5HtsM-i9Oe_GT_Bp0M-YBy08PTkyJfi0';

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}&language=fr`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  const formatted_address = data.results[0].formatted_address;
  return [coordinates, formatted_address]; 
  
}

export default getCoordsForAddress;
