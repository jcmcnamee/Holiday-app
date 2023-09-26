'use strict';

import axios from 'axios';
import * as utils from './utils.js';
import apiKey from './config.js';

// POST controllers
export async function submitDest(req, res) {
  const dest = req.body.dest;

  try {
    // OpenWeather API call
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${dest}&limit=5&appid=${apiKey}`
    );

    // Add countryFullName to object from ISO name
    const locationGeoData = utils.isoToCountry(response.data);

    // Send to front
    res.render('index.ejs', {
      countries: JSON.stringify(locationGeoData),
    });

    // Update handler
    locData.locations = locationGeoData;
  } catch (err) {
    console.error(err.data);
    res.status(500);
  }
}

export async function chooseDest(req, res) {
  locData.index = req.body.countryIndex;

  try {
    // OpenWeather API call
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${
        locData.locations[locData.index].lat
      }&lon=${
        locData.locations[locData.index].lon
      }&units=metric&appid=${apiKey}`
    );

    locData.addForecast(response.data.list);
    console.log(locData.forecast);
  } catch (err) {
    console.error(err.data);
    res.status(500);
  }

  //   res.render('index.js', {
  //     destination: locData.locations[locData.index],
  //   });
}

// local controllers
const locData = {
  index: 0,
  locations: [],
  forecast: [],

  addForecast: function (forecast) {
    for (let i in forecast) {
      this.forecast.push({
        temp: forecast[i].main.temp,
        feels: forecast[i].main.feels_like,
      });
    }
  },
};