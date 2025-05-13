
import { WeatherData } from '@/types/weather';
import { getWeatherIconUrl, formatDate } from '@/services/weatherService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Clock, Sunrise, Sunset } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  city: string;
  isLoading?: boolean;
}

export const CurrentWeather = ({ weather, city, isLoading = false }: CurrentWeatherProps) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { main, weather: weatherInfo, wind, sys } = weather;
  const currentWeather = weatherInfo[0];
  const iconUrl = getWeatherIconUrl(currentWeather.icon);
  
  // Конвертируем unix timestamp в локальные даты с учетом смещения часового пояса
  const localTime = new Date((weather.dt + weather.timezone) * 1000);
  const sunriseTime = new Date((sys.sunrise + weather.timezone) * 1000);
  const sunsetTime = new Date((sys.sunset + weather.timezone) * 1000);
  
  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Текущая дата с учетом таймзоны
  const currentDate = formatDate(weather.dt, weather.timezone);

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{city}</h2>
            <p className="text-sm text-muted-foreground">
              {currentDate} | <Clock className="inline h-4 w-4 mb-0.5" /> {formatTime(localTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(main.temp)}°C</div>
            <div className="text-sm">Ощущается как {Math.round(main.feels_like)}°C</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <img src={iconUrl} alt={currentWeather.description} className="w-20 h-20" />
          <div>
            <p className="text-lg capitalize">{currentWeather.description}</p>
            <p className="text-sm text-muted-foreground">
              Мин: {Math.round(main.temp_min)}°C / Макс: {Math.round(main.temp_max)}°C
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Thermometer className="text-red-500" />
            <div>
              <p className="text-sm font-medium">Давление</p>
              <p>{Math.round(main.pressure * 0.75)} мм рт.ст.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-500" />
            <div>
              <p className="text-sm font-medium">Влажность</p>
              <p>{main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="text-gray-500" />
            <div>
              <p className="text-sm font-medium">Ветер</p>
              <p>{Math.round(wind.speed)} м/с</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-4">
              <div>
                <Sunrise className="text-orange-500 inline mr-1" />
                <span className="text-sm">{formatTime(sunriseTime)}</span>
              </div>
              <div>
                <Sunset className="text-amber-500 inline mr-1" />
                <span className="text-sm">{formatTime(sunsetTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
