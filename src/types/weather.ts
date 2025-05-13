
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    pressure: number;
    description: string;
    icon: string;
  };
  forecast: ForecastData[];
}

export interface ForecastData {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
