'use strict';

import axios from 'axios';
import * as utils from './utils.js';
import { apiKey } from './config.js';

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

    locData.addForecasts(response.data.list);
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
  dailyForecasts: [],

  addForecasts: function (forecastArr) {
    // Get date string for each forecast
    let dates = forecastArr.map(forecast => forecast.dt_txt);

    // Parse into workable units
    dates = dates.map(dateStr => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const hour = date.getHours();
      return { day, hour };
    });

    // Get weather for each forecast
    let tempData = forecastArr.map(forecast => forecast.main.temp);
    let weatherIcons = forecastArr.map(forecast => forecast.weather.icon);
    let windData = forecastArr.map(forecast => forecast.wind.speed);

    // Marry with dates
    dates.forEach((date, index) => {
      date.forecast = {};
      date.forecast.temp = tempData[index];
      date.forecast.weather = weatherIcons[index];
      date.forecast.windData = windData[index];
    });

    // Get unique days forecast
    this.dailyForecasts = [...new Set(dates.map(date => date.day))];
    console.log(`Daily forecasts: ${this.dailyForecasts}`);
    console.log(dates.filter(date => date.day === 28));

    //
    this.dailyForecasts = this.dailyForecasts.map(forecast => {
      return dates.filter(date => date.day === forecast);
    });

    console.log(this.dailyForecasts);
  },
};
