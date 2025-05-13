
import { ForecastData } from '@/types/weather';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastChartProps {
  forecast: ForecastData;
}

export const ForecastChart = ({ forecast }: ForecastChartProps) => {
  // Подготовка данных для графика - берем только следующие 24-36 часов (8-12 точек при 3-часовом интервале)
  const chartData = forecast.list.slice(0, 12).map((item) => {
    // Получаем время в формате "HH:00"
    const date = new Date(item.dt * 1000);
    const hours = date.getHours();
    const timeLabel = `${hours}:00`;
    
    // Получаем значения для графика
    return {
      time: timeLabel,
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      // Добавляем вероятность осадков в процентах (pop - probability of precipitation)
      precipitation: Math.round(item.pop * 100)
    };
  });

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-md font-medium">График температуры и осадков</h3>
        <p className="text-xs text-muted-foreground">Прогноз на ближайшие 36 часов</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="temp" 
            name="Температура, °C" 
            stroke="#ff7300" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="feelsLike" 
            name="Ощущается как, °C" 
            stroke="#ffc658" 
            strokeDasharray="5 5" 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="precipitation" 
            name="Вероятность осадков, %" 
            stroke="#8884d8" 
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
