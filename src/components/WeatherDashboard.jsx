import { useState } from "react";
import {
  Search,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Flag,
} from "lucide-react";
import axios from "axios";
import "./WeatherDashboard.css";

const API_KEY = "4b095fafeb1ee1100397b5ebed5f8d2c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("forecast", forecast);
  console.log("weather", weather);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(forecastResponse.data);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun size={24} />;
      case "clouds":
        return <Cloud size={24} />;
      case "rain":
        return <CloudRain size={24} />;
      default:
        return <Cloud size={24} />;
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h1 className="text-center mb-4">Weather Dashboard</h1>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    <Search size={20} className="me-2" />
                    Search
                  </button>
                </div>
              </form>

              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Current Weather */}
              {weather && (
                <div className="current-weather mb-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <h2 className="card-title mb-0 me-2">{weather.name}</h2>
                        <Flag size={20} className="country-flag" />
                        <span className="ms-2 text-uppercase">
                          {weather.sys.country}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="display-4">
                            {Math.round(weather.main.temp)}°C
                          </h3>
                          <p className="lead">
                            {weather.weather[0].description}
                          </p>
                        </div>
                        <div className="weather-icon">
                          {getWeatherIcon(weather.weather[0].main)}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <Droplets size={20} className="me-2" />
                          Humidity: {weather.main.humidity}%
                        </div>
                        <div className="col">
                          <Wind size={20} className="me-2" />
                          Wind: {weather.wind.speed} m/s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5-Day Forecast */}
              {forecast && (
                <div className="forecast">
                  <h3 className="mb-3">5-Day Forecast</h3>
                  <div className="row">
                    {forecast.list
                      .filter((item, index) => index % 8 === 0)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="col">
                          <div className="card h-100">
                            <div className="card-body text-center">
                              <h5>
                                {new Date(item.dt * 1000).toLocaleDateString(
                                  "en-US",
                                  { weekday: "short" }
                                )}
                              </h5>
                              <div className="weather-icon my-2">
                                {getWeatherIcon(item.weather[0].main)}
                              </div>
                              <p className="mb-0">
                                {Math.round(item.main.temp)}°C
                              </p>
                              <small className="text-muted">
                                {item.weather[0].description}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDashboard;
