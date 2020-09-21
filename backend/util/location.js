const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.MAPBOX_API_KEY;

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${API_KEY}`
  );
  const data = response.data;
  const coordinates = data.features[0].geometry.coordinates;

  // Throw an error
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  return {
    lat: coordinates[1],
    lng: coordinates[0],
  };
}

module.exports = getCoordsForAddress;
