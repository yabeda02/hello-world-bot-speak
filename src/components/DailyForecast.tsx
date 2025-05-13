
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/weather";

interface DailyForecastProps {
  data: WeatherData;
}

export function DailyForecast({ data }: DailyForecastProps) {
  // Группировка прогноза по дням
  const dailyData = data.forecast.reduce<Record<string, any>>((acc, item) => {
    const date = new Date(item.dt).toLocaleDateString("ru-RU");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Создаем массив с данными по дням
  const dailyForecast = Object.entries(dailyData).map(([date, items]) => {
    const temps = (items as any[]).map((item) => item.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const icon = (items as any[])[Math.floor(items.length / 2)].icon;
    const description = (items as any[])[Math.floor(items.length / 2)].description;

    return {
      date,
      maxTemp,
      minTemp,
      icon,
      description,
    };
  });

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Прогноз на 5 дней</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {dailyForecast.slice(0, 5).map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 border rounded-md hover:bg-muted transition-colors"
            >
              <div className="font-medium">
                {new Date(day.date).toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <img
                src={getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="w-12 h-12 my-2"
              />
              <div className="capitalize text-xs text-center text-muted-foreground">
                {day.description}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="font-bold">{Math.round(day.maxTemp)}°</span>
                <span className="text-muted-foreground">
                  {Math.round(day.minTemp)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
