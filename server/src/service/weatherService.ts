import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  description: string;

  constructor(temperature: number, humidity: number, description: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string | null = null;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetch location data from the OpenWeatherMap API based on the city name
  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Destructure location data into the Coordinates interface
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  // Build the geocode query URL for fetching the location based on the city name
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}?q=${query}&appid=${this.apiKey}`;
  }

  // Build the weather query URL using latitude and longitude
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Fetch and destructure location data in one method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Fetch weather data from the OpenWeatherMap API using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    const data = await response.json();

    // Extract the 5-day/3-hour forecast list from the response
    const forecastArray = this.buildForecastArray(data.list);

    return forecastArray;
  }

  // Parse current weather data from the API response
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main.temp;
    const humidity = response.main.humidity;
    const description = response.weather[0].description;
    return new Weather(temperature, humidity, description);
  }

 // Build forecast array using the OpenWeather API response
private buildForecastArray(weatherData: any[]): any[] {
  return weatherData.map((day: any) => {
    return {
      temperature: day.main.temp, // Access temperature
      description: day.weather[0].description, // Access weather description
      date: day.dt_txt, // Access the date and time
    };
  });
}
  // Get weather for a given city
  async getWeatherForCity(city: string): Promise<Weather | null> {
    this.cityName = city;
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      return this.parseCurrentWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }
}

export default new WeatherService();
