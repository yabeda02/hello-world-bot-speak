
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto mb-8">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Введите название города..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          className="pr-10"
        />
      </div>
      <Button type="submit" disabled={loading || !city.trim()}>
        <Search className="h-4 w-4 mr-2" />
        Поиск
      </Button>
    </form>
  );
};
