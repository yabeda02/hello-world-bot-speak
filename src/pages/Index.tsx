
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { ForecastChart } from "@/components/ForecastChart";
import { useToast } from "@/hooks/use-toast";
import { CityInfo, WeatherData, ForecastData } from "@/types/weather";
import { fetchWeatherByCoords, fetchWeatherByCity, fetchForecastByCoords } from "@/services/weatherService";
import { DEFAULT_CITY } from "@/config/api";

const Index = () => {
  const [city, setCity] = useState<CityInfo>(DEFAULT_CITY);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Загрузка погоды по текущей локации
  const loadWeatherData = async (lat: number, lon: number, cityName?: string) => {
    try {
      setLoading(true);
      const weatherData = await fetchWeatherByCoords(lat, lon);
      const forecastData = await fetchForecastByCoords(lat, lon);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCity({ name: cityName || weatherData.name, lat, lon });
    } catch (error) {
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось получить данные о погоде. Попробуйте позже.",
        variant: "destructive",
      });
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Получение геолокации пользователя
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Если геолокация недоступна, загружаем данные для дефолтного города
          loadWeatherData(DEFAULT_CITY.lat, DEFAULT_CITY.lon, DEFAULT_CITY.name);
          toast({
            title: "Геолокация недоступна",
            description: `Показываем погоду для города ${DEFAULT_CITY.name} по умолчанию.`,
          });
        }
      );
    } else {
      loadWeatherData(DEFAULT_CITY.lat, DEFAULT_CITY.lon, DEFAULT_CITY.name);
      toast({
        description: "Ваш браузер не поддерживает геолокацию",
      });
    }
  };

  // Поиск города и загрузка данных для него
  const handleCitySearch = async (cityName: string) => {
    try {
      setLoading(true);
      const weatherData = await fetchWeatherByCity(cityName);
      if (weatherData) {
        loadWeatherData(weatherData.coord.lat, weatherData.coord.lon, weatherData.name);
      }
    } catch (error) {
      toast({
        title: "Город не найден",
        description: "Пожалуйста, проверьте название города и попробуйте снова.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Первоначальная загрузка данных
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Прогноз погоды</h1>
      
      <SearchBar onSearch={handleCitySearch} loading={loading} />
      
      {currentWeather && (
        <CurrentWeather 
          weather={currentWeather} 
          city={city.name} 
          isLoading={loading} 
        />
      )}
      
      {forecast && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Прогноз на 5 дней</h2>
            <ForecastChart forecast={forecast} />
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Ежедневный прогноз</h2>
            <DailyForecast forecast={forecast} />
          </div>
        </>
      )}
      
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Index;
