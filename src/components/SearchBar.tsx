
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { City } from "@/types/weather";
import { searchCity } from "@/services/weatherService";
import { MapPin } from "lucide-react";

interface SearchBarProps {
  onSelectCity: (city: City) => void;
  onUseCurrentLocation: () => void;
}

export function SearchBar({ onSelectCity, onUseCurrentLocation }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;

    try {
      setIsLoading(true);
      const cities = await searchCity(query);
      setResults(cities);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2 mb-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите город..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          Поиск
        </Button>
        <Button variant="outline" onClick={onUseCurrentLocation} title="Использовать текущее местоположение">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {results.length > 0 && (
        <div className="bg-background border rounded-md shadow-sm mt-1 absolute z-10 w-full max-w-md">
          {results.map((city, index) => (
            <div
              key={`${city.name}-${city.lat}-${index}`}
              className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
              onClick={() => {
                onSelectCity(city);
                setResults([]);
                setQuery("");
              }}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
