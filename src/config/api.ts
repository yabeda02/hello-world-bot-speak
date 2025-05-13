
export const WEATHER_API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_BASE_URL: 'https://api.openweathermap.org/geo/1.0',
  API_KEY: '', // Необходимо добавить API ключ от OpenWeatherMap
  DEFAULT_UNITS: 'metric', // metric для Цельсия, imperial для Фаренгейта
  DEFAULT_LANG: 'ru',
};

// Укажите здесь дефолтный город для первоначальной загрузки, 
// если геолокация будет недоступна
export const DEFAULT_CITY = {
  name: 'Москва',
  lat: 55.7558,
  lon: 37.6173,
};
