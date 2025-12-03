// src/api/weatherApi.js
import axios from "axios";

const openMeteoBase = "https://api.open-meteo.com/v1/forecast";

/**
 * Weather API using Open-Meteo (FREE)
 * Fetches current weather + last 30 days summary
 */
export const getWeatherSummary = async (lat, lon) => {
  try {
    const params = {
      latitude: lat,
      longitude: lon,
      hourly: "temperature_2m,relativehumidity_2m,windspeed_10m",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
      past_days: 30,
      timezone: "auto",
    };

    const res = await axios.get(openMeteoBase, { params });

    const current = {
      temperature: res.data.hourly.temperature_2m?.slice(-1)[0] ?? null,
      humidity: res.data.hourly.relativehumidity_2m?.slice(-1)[0] ?? null,
      windspeed: res.data.hourly.windspeed_10m?.slice(-1)[0] ?? null,
    };

    const last30 = {
      dailyDates: res.data.daily.time || [],
      dailyMax: res.data.daily.temperature_2m_max || [],
      dailyMin: res.data.daily.temperature_2m_min || [],
      dailyPrecip: res.data.daily.precipitation_sum || [],
    };

    return { current, last30 };
  } catch (err) {
    console.warn("Weather fetch failed:", err.message || err);
    return null; // frontend will use dummy data if needed
  }
};
