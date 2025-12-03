const express = require('express');
const request = require('request');
const router = express.Router();

// Capitalises first letter of a string 
function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

router.get('/', (req, res, next) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // Missing API key
      return res.status(500).render('weather', {
        error: 'OpenWeather API key not configured. Please set OPENWEATHER_API_KEY in .env',
        weather: null,
        city: ''
      });
    }

    // Use query city or default to London
    const cityQuery = (req.query.city && req.query.city.trim()) ? req.query.city.trim() : 'london';
    const city = cityQuery;

    // Build request URL safely
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

    // Add timeout to avoid hanging
    request({ url, timeout: 5000 }, (err, response, body) => {
      if (err) {
        console.error('Weather request failed:', err && err.message ? err.message : err);
        return res.render('weather', {
          error: 'Unable to fetch weather (network error). Try again later.',
          weather: null,
          city
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(body); // API return valid JSON
      } catch (parseErr) {
        console.error('JSON parse error from weather API:', parseErr);
        return res.render('weather', { error: 'Invalid response from weather service.', weather: null, city });
      }

      // OpenWeather sends "cod" + "message" when failing 
      if (!parsed || typeof parsed !== 'object' || parsed.cod === '404' || !parsed.main) {
        const msg = (parsed && parsed.message) ? parsed.message : 'No data found for that location.';
        return res.render('weather', { error: `No data found: ${msg}`, weather: null, city });
      }

      // Extract only the fields used
      const weather = {
        name: parsed.name,
        temp: parsed.main.temp,
        feels_like: parsed.main.feels_like,
        humidity: parsed.main.humidity,
        pressure: parsed.main.pressure,
        wind_speed: (parsed.wind && parsed.wind.speed) ? parsed.wind.speed : null,
        wind_deg: (parsed.wind && parsed.wind.deg) ? parsed.wind.deg : null,
        description: (parsed.weather && parsed.weather[0] && parsed.weather[0].description)
          ? capitalize(parsed.weather[0].description)
          : null,
        icon: (parsed.weather && parsed.weather[0] && parsed.weather[0].icon)
          ? parsed.weather[0].icon
          : null
      };

      // Render final template with weather data
      res.render('weather', { error: null, weather, city });
    });
  } catch (ex) {
    console.error('Unexpected error in /weather route:', ex);
    next(ex); // Express handle unexpected server errors
  }
});

module.exports = router;

