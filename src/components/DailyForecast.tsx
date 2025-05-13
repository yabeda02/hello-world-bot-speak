
import { ForecastData } from '@/types/weather';
import { groupForecastByDay, getWeatherIconUrl } from '@/services/weatherService';
import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface DailyForecastProps {
  forecast: ForecastData;
}

export const DailyForecast = ({ forecast }: DailyForecastProps) => {
  const dailyData = groupForecastByDay(forecast).slice(0, 5); // Ограничиваем 5 днями
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {dailyData.map((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        
        return (
          <Card key={index} className="overflow-hidden">
            <div className="bg-primary/10 p-3 text-center">
              <p className="font-medium">{index === 0 ? 'Сегодня' : dayName}</p>
              <p className="text-xs text-muted-foreground">{dayMonth}</p>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <img 
                  src={getWeatherIconUrl(day.icon)} 
                  alt={day.description} 
                  className="w-16 h-16" 
                />
                <p className="text-sm text-center mb-3 capitalize">{day.description}</p>
                
                <div className="flex justify-center gap-2 mb-2">
                  <p className="font-medium">{Math.round(day.dayTemp)}°</p>
                  <p className="text-muted-foreground">{Math.round(day.nightTemp)}°</p>
                </div>
                
                <div className="grid grid-cols-3 w-full text-center text-xs gap-1">
                  <div>
                    <Droplets className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                    <span>{day.humidity}%</span>
                  </div>
                  <div>
                    <Wind className="h-3 w-3 mx-auto mb-1 text-gray-500" />
                    <span>{Math.round(day.windSpeed)} м/с</span>
                  </div>
                  <div>
                    <Thermometer className="h-3 w-3 mx-auto mb-1 text-red-500" />
                    <span>{day.precipitation.toFixed(1)} мм</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
