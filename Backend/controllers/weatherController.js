import User from "../models/User.js";
import fetch from "node-fetch";

// Dummy fallback weather
const dummyWeather = {
  temp: 28,
  humidity: 55,
  wind: 12,
  condition: "Sunny (Dummy)",
  history: Array.from({ length: 24 * 7 }).map((_, i) => ({
    time: `Day-${Math.floor(i / 24)} Hr-${i % 24}`,
    temp: 24 + Math.sin(i / 5) * 3,
    humidity: 50 + Math.sin(i / 7) * 8,
  })),
};

export const getWeather = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let location = user.location;

    // If no location → return dummy immediately
    if (!location) {
      return res.status(200).json({
        source: "dummy-no-location",
        weather: dummyWeather,
      });
    }

    let lat, lon;

    // Case 1 — Already "lat, lon"
    if (location.includes(",")) {
      const parts = location.split(",");
      lat = Number(parts[0].trim());
      lon = Number(parts[1].trim());
    }

    // Case 2 — Text address → convert to lat, lon
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );

        const geoData = await geo.json();
        if (!geoData.length) throw new Error("Geo lookup failed");

        lat = Number(geoData[0].lat);
        lon = Number(geoData[0].lon);

        // Save converted coords to user profile
        user.location = `${lat}, ${lon}`;
        await user.save();
      } catch (err) {
        return res.status(200).json({
          source: "dummy-geocode-failed",
          weather: dummyWeather,
        });
      }
    }

    // WEATHER FETCH
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m&past_days=7`;

      const data = await fetch(url).then((r) => r.json());

      if (!data.current) throw new Error("Invalid weather");

      return res.status(200).json({
        source: "live-weather",
        weather: {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          wind: data.current.wind_speed_10m,
          condition: "Live Weather",
          history: data.hourly.time.map((t, i) => ({
            time: t,
            temp: data.hourly.temperature_2m[i],
            humidity: data.hourly.relative_humidity_2m[i],
          })),
        },
      });
    } catch (e) {
      return res.status(200).json({
        source: "dummy-weather-failed",
        weather: dummyWeather,
      });
    }
  } catch (err) {
    console.error("Weather Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
