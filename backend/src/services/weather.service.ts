import { WeatherData, Location } from "../types/index.js";

/**
 * Weather Service
 * Fetches real-time weather data from public APIs
 * Returns formatted weather data for analysis
 */
export class WeatherService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WEATHER_API_KEY || "";
    this.apiEndpoint = "https://api.openweathermap.org/data/2.5";
  }

  /**
   * Fetch current weather for a location
   */
  async getCurrentWeather(location: Location): Promise<WeatherData> {
    try {
      // Return mock data if no API key
      if (!this.apiKey) {
        console.warn("No Weather API key found. Using mock data for demo.");
        return this.getMockWeatherData(location);
      }

      const response = await fetch(
        `${this.apiEndpoint}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        console.warn(`Weather API error: ${response.statusText}. Using mock data for demo.`);
        return this.getMockWeatherData(location);
      }

      const data = await response.json() as any;

      return {
        timestamp: new Date(),
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] || 0,
        windSpeed: data.wind.speed,
        uvIndex: await this.getUVIndex(location),
        soilMoisture: await this.estimateSoilMoisture(location, data),
        location,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      console.warn("Falling back to mock weather data for demo.");
      return this.getMockWeatherData(location);
    }
  }

  /**
   * Get UV Index for a location
   */
  private async getUVIndex(location: Location): Promise<number> {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/uvi?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}`
      );

      if (!response.ok) return 0;

      const data = await response.json() as any;
      return data.value || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Estimate soil moisture from weather conditions
   * This is a simplified model; real implementation would use soil sensors
   */
  private async estimateSoilMoisture(
    location: Location,
    weatherData: any
  ): Promise<number> {
    // Simplified model: humidity + recent rainfall
    const humidity = weatherData.main.humidity;
    const recentRainfall = weatherData.rain?.["1h"] || 0;

    // Soil moisture = humidity (in %) + rainfall adjustment
    let moisture = Math.min(100, humidity + recentRainfall * 5);

    // For demonstration, add some variation based on location
    const locationSeed = location.latitude + location.longitude;
    const variation = Math.sin(locationSeed) * 10;
    moisture = Math.max(10, Math.min(100, moisture + variation));

    return parseFloat(moisture.toFixed(2));
  }

  /**
   * Get forecast for next N days
   */
  async getForecast(location: Location, days: number = 5): Promise<WeatherData[]> {
    try {
      // Return mock data if no API key
      if (!this.apiKey) {
        console.warn("No Weather API key found. Using mock forecast data for demo.");
        return this.getMockForecast(location, days);
      }

      const response = await fetch(
        `${this.apiEndpoint}/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        console.warn(`Forecast API error: ${response.statusText}. Using mock forecast data for demo.`);
        return this.getMockForecast(location, days);
      }

      const data = await response.json() as any;
      const forecasts: WeatherData[] = [];

      // Process 5-day forecast (data comes in 3-hour intervals)
      const dayForecasts = data.list.slice(0, days * 8); // 8 intervals per day

      for (let i = 0; i < dayForecasts.length; i += 8) {
        const dayData = dayForecasts[i];
        forecasts.push({
          timestamp: new Date(dayData.dt * 1000),
          temperature: dayData.main.temp,
          humidity: dayData.main.humidity,
          rainfall: dayData.rain?.["3h"] || 0,
          windSpeed: dayData.wind.speed,
          uvIndex: 0, // UVI forecast not available in free API
          soilMoisture: await this.estimateSoilMoisture(location, dayData),
          location,
        });
      }

      return forecasts;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      console.warn("Falling back to mock forecast data for demo.");
      return this.getMockForecast(location, days);
    }
  }

  /**
   * Get agricultural alerts based on weather conditions
   */
  getWeatherAlerts(weather: WeatherData): string[] {
    const alerts: string[] = [];

    if (weather.temperature < 0) {
      alerts.push("Frost risk detected - protect sensitive crops");
    }
    if (weather.temperature > 40) {
      alerts.push("Heat stress risk - increase irrigation");
    }
    if (weather.rainfall > 100) {
      alerts.push("Heavy rainfall - waterlogging risk");
    }
    if (weather.humidity > 90) {
      alerts.push(
        "High humidity - fungal disease risk (powdery mildew, leaf spot)"
      );
    }
    if (weather.windSpeed > 40) {
      alerts.push("High wind speed - crop lodging risk");
    }
    if (weather.uvIndex > 8) {
      alerts.push("High UV index - protect against sun damage");
    }

    return alerts;
  }

  /**
   * Get mock weather data for demo/development
   */
  private getMockWeatherData(location: Location): WeatherData {
    const baseTemp = 25 + Math.sin(location.latitude) * 10;
    const season = (new Date().getMonth() % 12) / 4; // 0-3 representing seasons
    
    return {
      timestamp: new Date(),
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 5) * 10) / 10,
      humidity: Math.round(60 + Math.random() * 30),
      rainfall: Math.random() > 0.7 ? Math.round(Math.random() * 50) : 0,
      windSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
      uvIndex: Math.round(4 + Math.sin(season) * 3 + (Math.random() - 0.5) * 2),
      soilMoisture: Math.round((55 + Math.random() * 30) * 10) / 10,
      location,
    };
  }

  /**
   * Get mock forecast for demo/development
   */
  private getMockForecast(location: Location, days: number): WeatherData[] {
    const forecasts: WeatherData[] = [];
    const baseTemp = 25 + Math.sin(location.latitude) * 10;
    
    for (let i = 0; i < days; i++) {
      const timestamp = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const tempVariation = Math.sin(i / days * Math.PI) * 5;
      
      forecasts.push({
        timestamp,
        temperature: Math.round((baseTemp + tempVariation + (Math.random() - 0.5) * 3) * 10) / 10,
        humidity: Math.round(60 + Math.sin(i) * 15 + (Math.random() - 0.5) * 10),
        rainfall: i % 3 === 0 ? Math.round(Math.random() * 40) : Math.round(Math.random() * 10),
        windSpeed: Math.round((5 + Math.random() * 12) * 10) / 10,
        uvIndex: Math.round(3 + Math.cos(i / days * Math.PI) * 2 + (Math.random() - 0.5)),
        soilMoisture: Math.round((50 + Math.random() * 35) * 10) / 10,
        location,
      });
    }
    
    return forecasts;
  }
}
