
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/weather";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ForecastChartProps {
  data: WeatherData;
  type: "temperature" | "precipitation";
}

export function ForecastChart({ data, type }: ForecastChartProps) {
  const chartData = data.forecast.map((item) => ({
    time: new Date(item.dt).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(item.dt).toLocaleDateString("ru-RU", {
      month: "short",
      day: "numeric",
    }),
    fullDate: new Date(item.dt),
    value: type === "temperature" ? Math.round(item.temp) : item.precipitation,
  }));

  const config = {
    temp: {
      label: "Температура",
      theme: {
        light: "#f97316",
        dark: "#f97316",
      },
    },
    precip: {
      label: "Осадки",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9",
      },
    },
  };

  const title = type === "temperature" ? "Прогноз температуры" : "Прогноз осадков";
  const unit = type === "temperature" ? "°C" : "мм";
  const color = type === "temperature" ? "#f97316" : "#0ea5e9";
  const dataKey = type === "temperature" ? "temp" : "precip";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          className="h-[300px]"
          config={config}
        >
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              name={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <CartesianGrid stroke="#ccc" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Дата
                          </span>
                          <span className="font-bold">
                            {data.date}, {data.time}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {type === "temperature" ? "Температура" : "Осадки"}
                          </span>
                          <span className="font-bold">
                            {data.value}
                            {unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
