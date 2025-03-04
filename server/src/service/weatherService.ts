import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  date: string;
  temperature: number;
  wind: number;
  humidity: number;
  description: string;
  icon: string;
  iconDescription: string;
  

  constructor(city: string, temperature: number, wind: number, humidity: number, description: string, icon: string, iconDescription: string) {
    this.city = city;
    this.date = new Date().toLocaleDateString();
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
    this.city = city;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.iconDescription = iconDescription;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string = '';

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.WEATHER_API_KEY || '';
  }

  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      this.city,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].description,
      response.weather[0].icon,
      response.weather[0].main
    );
  }

  public async getWeatherForCity(city: string): Promise<Weather> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();