
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeatherData, getUserLocation } from "@/services/weatherService";
import { WeatherData, City } from "@/types/weather";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeather } from "@/components/CurrentWeather";
import { ForecastChart } from "@/components/ForecastChart";
import { DailyForecast } from "@/components/DailyForecast";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Функция для получения погоды по координатам
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    return await getWeatherData(lat, lon);
  };

  // Запрос на получение данных о погоде
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', selectedCity?.lat, selectedCity?.lon],
    queryFn: () => {
      if (selectedCity) {
        return fetchWeatherByCoords(selectedCity.lat, selectedCity.lon);
      }
      throw new Error("Город не выбран");
    },
    enabled: !!selectedCity,
  });

  // Обработчик выбора города
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
  };

  // Обработчик использования текущего местоположения
  const handleUseCurrentLocation = async () => {
    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      
      // Загружаем данные о погоде для получения названия города
      const data = await fetchWeatherByCoords(latitude, longitude);
      
      setSelectedCity({
        name: data.location.name,
        country: data.location.country,
        lat: latitude,
        lon: longitude,
      });
      
      toast.success("Местоположение определено");
    } catch (error) {
      console.error("Ошибка при определении местоположения:", error);
      toast.error("Не удалось определить местоположение");
    }
  };

  // При первом рендере пытаемся определить местоположение пользователя
  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  // Если произошла ошибка при загрузке данных
  useEffect(() => {
    if (error) {
      toast.error("Ошибка при загрузке данных о погоде");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Прогноз погоды</h1>
        
        <div className="mb-6">
          <SearchBar 
            onSelectCity={handleSelectCity} 
            onUseCurrentLocation={handleUseCurrentLocation} 
          />
        </div>

        {selectedCity && (
          <div className="text-center mb-4 flex items-center justify-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {selectedCity.name}, {selectedCity.country}
            </span>
          </div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <LoadingState />
          ) : weatherData ? (
            <>
              <CurrentWeather data={weatherData} />
              <div className="grid md:grid-cols-2 gap-6">
                <ForecastChart data={weatherData} type="temperature" />
                <ForecastChart data={weatherData} type="precipitation" />
              </div>
              <DailyForecast data={weatherData} />
            </>
          ) : selectedCity ? (
            <div className="text-center p-10">
              <p>Загрузка данных о погоде...</p>
            </div>
          ) : (
            <div className="text-center p-10">
              <p>Выберите город или используйте текущее местоположение</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-[200px] rounded-lg" />
    <div className="grid md:grid-cols-2 gap-6">
      <Skeleton className="w-full h-[300px] rounded-lg" />
      <Skeleton className="w-full h-[300px] rounded-lg" />
    </div>
    <Skeleton className="w-full h-[200px] rounded-lg" />
  </div>
);

export default Index;
