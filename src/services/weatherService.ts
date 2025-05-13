
import { WeatherData, City } from '@/types/weather';

// API ключ для OpenWeatherMap
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Получаем текущую погоду
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
    );
    const currentData = await currentResponse.json();

    // Получаем прогноз на 5 дней
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
    );
    const forecastData = await forecastResponse.json();

    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      forecast: forecastData.list.map((item: any) => ({
        dt: item.dt * 1000, // Convert to milliseconds
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pressure: item.main.pressure,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: item.rain ? item.rain['3h'] || 0 : 0,
      })),
    };
  } catch (error) {
    console.error('Ошибка при получении данных о погоде:', error);
    throw error;
  }
}

export async function searchCity(query: string): Promise<City[]> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Ошибка при поиске города:', error);
    throw error;
  }
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается вашим браузером'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}
