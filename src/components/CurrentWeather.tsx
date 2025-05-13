
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/weather";
import { Cloud, Wind, Droplet, Thermometer } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const { current, location } = data;

  const getWeatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div>
            {location.name}, {location.country}
          </div>
          <div className="text-base font-normal text-muted-foreground">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <img
              src={getWeatherIconUrl(current.icon)}
              alt={current.description}
              className="w-20 h-20"
            />
            <div className="ml-2">
              <div className="text-4xl font-bold">{Math.round(current.temp)}°C</div>
              <div className="text-muted-foreground capitalize">
                {current.description}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
              <div>
                <div className="text-sm text-muted-foreground">Ощущается как</div>
                <div>{Math.round(current.feels_like)}°C</div>
              </div>
            </div>
            <div className="flex items-center">
              <Wind className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Ветер</div>
                <div>{current.wind_speed} м/с</div>
              </div>
            </div>
            <div className="flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Влажность</div>
                <div>{current.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <div className="text-sm text-muted-foreground">Давление</div>
                <div>{current.pressure} гПа</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
