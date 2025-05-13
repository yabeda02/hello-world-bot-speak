
import { WeatherData, ForecastData, ForecastItem } from "@/types/weather";
import { WEATHER_API_CONFIG } from "@/config/api";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || WEATHER_API_CONFIG.API_KEY;
const BASE_URL = WEATHER_API_CONFIG.BASE_URL;
const GEO_BASE_URL = WEATHER_API_CONFIG.GEO_BASE_URL;
const UNITS = WEATHER_API_CONFIG.DEFAULT_UNITS;
const LANG = WEATHER_API_CONFIG.DEFAULT_LANG;

// Получение текущей погоды по координатам
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении данных о погоде:", error);
    throw error;
  }
};

// Получение текущей погоды по названию города
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении данных о погоде по городу:", error);
    throw error;
  }
};

// Получение прогноза погоды на 5 дней по координатам
export const fetchForecastByCoords = async (
  lat: number,
  lon: number
): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении прогноза погоды:", error);
    throw error;
  }
};

// Получение прогноза погоды на 5 дней по названию города
export const fetchForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении прогноза погоды по городу:", error);
    throw error;
  }
};

// Получение полного списка городов по названию (для автозаполнения)
export const searchCitiesByName = async (query: string): Promise<any[]> => {
  if (query.length < 3) return [];
  
  try {
    const response = await fetch(
      `${GEO_BASE_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Ошибка при поиске городов:", error);
    return [];
  }
};

// Функция-помощник для форматирования даты
export const formatDate = (dt: number, timezone: number = 0): string => {
  const date = new Date((dt + timezone) * 1000);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

// Функция-помощник для получения URL иконки погоды
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Группировка прогноза по дням (для отображения дневного прогноза)
export const groupForecastByDay = (forecast: ForecastData) => {
  const dailyForecasts: { [key: string]: ForecastItem[] } = {};
  
  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!dailyForecasts[dateStr]) {
      dailyForecasts[dateStr] = [];
    }
    
    dailyForecasts[dateStr].push(item);
  });
  
  return Object.keys(dailyForecasts).map((date) => {
    const items = dailyForecasts[date];
    const dayItems = items.filter(
      (item) => new Date(item.dt * 1000).getHours() >= 6 && new Date(item.dt * 1000).getHours() <= 18
    );
    const nightItems = items.filter(
      (item) => new Date(item.dt * 1000).getHours() < 6 || new Date(item.dt * 1000).getHours() > 18
    );
    
    // Получаем среднюю температуру за день и ночь
    const dayTemp = dayItems.length
      ? dayItems.reduce((sum, item) => sum + item.main.temp, 0) / dayItems.length
      : items[0].main.temp;
      
    const nightTemp = nightItems.length
      ? nightItems.reduce((sum, item) => sum + item.main.temp, 0) / nightItems.length
      : items[0].main.temp;
    
    // Получаем описание погоды за день (берем из полудня или первого доступного времени)
    const middayItem = items.find((item) => new Date(item.dt * 1000).getHours() === 12) || items[0];
    
    // Расчет суммы осадков за день
    const precipitation = items.reduce((sum, item) => {
      const rain = item.rain?.["3h"] || 0;
      const snow = item.snow?.["3h"] || 0;
      return sum + rain + snow;
    }, 0);
    
    return {
      date,
      dayTemp,
      nightTemp,
      description: middayItem.weather[0].description,
      icon: middayItem.weather[0].icon,
      precipitation,
      humidity: middayItem.main.humidity,
      windSpeed: middayItem.wind.speed,
    };
  });
};
