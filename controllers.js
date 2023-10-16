'use strict';

import axios from 'axios';
import * as utils from './utils.js';
import { apiKey } from './config.js';

// POST controllers //
// OpenWeather Geolocation API call
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
    weatherHandler.locations = locationGeoData;
  } catch (err) {
    console.error(err.data);
    res.status(500);
  }
}

// OpenWeather get forecasts API call
export async function chooseDest(req, res) {
  weatherHandler.index = req.body.countryIndex;

  try {
    // OpenWeather API call
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${
        weatherHandler.locations[weatherHandler.index].lat
      }&lon=${
        weatherHandler.locations[weatherHandler.index].lon
      }&units=metric&appid=${apiKey}`
    );

    // Pass data to weather handler object
    weatherHandler.addForecasts(response.data.list);

    // Send forecast data to front end
    res.render('index.ejs', {
      forecasts: JSON.stringify(weatherHandler.dailyForecasts),
    });
  } catch (err) {
    console.error(err.data);
    res.status(500);
  }
}

// local controllers
const weatherHandler = {
  locations: [],
  dailyForecasts: [],

  addForecasts: function (allForecasts) {
    // Get date string for each forecast
    let dates = allForecasts.map(forecast => forecast.dt_txt);

    // Parse into workable units
    dates = dates.map(dateStr => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const hour = date.getHours();
      return { day, hour };
    });

    // Get weather for each forecast
    let tempData = allForecasts.map(forecast => forecast.main.temp);
    let weatherIcons = allForecasts.map(forecast => forecast.weather.icon);
    let windData = allForecasts.map(forecast => forecast.wind.speed);

    // Marry with dates
    dates.forEach((date, index) => {
      date.forecast = {
        temp: tempData[index],
        weather: weatherIcons[index],
        wind: windData[index],
      };
    });

    // Get unique days forecast
    this.dailyForecasts = [...new Set(dates.map(date => date.day))];

    //
    this.dailyForecasts = this.dailyForecasts.map(forecast => {
      return dates.filter(date => date.day === forecast);
    });
  },
};
