'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ArrowUpDown } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
  };
}

interface ModelTableProps {
  models: Model[];
  timestamp: string;
}

type SortField = 'name' | 'provider' | 'inputPrice' | 'outputPrice' | 'contextLength' | 'modality';
type SortOrder = 'asc' | 'desc';

const PROVIDER_COLORS: Record<string, string> = {
  openai: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  anthropic: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  google: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  meta: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
  mistral: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  cohere: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
  default: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
};

function extractProvider(id: string): string {
  const parts = id.split('/');
  return parts[0] || 'unknown';
}

function getProviderColor(provider: string): string {
  const key = provider.toLowerCase();
  return PROVIDER_COLORS[key] || PROVIDER_COLORS.default;
}

function formatPrice(priceStr: string): string {
  const price = parseFloat(priceStr) * 1000000;
  return `$${price.toFixed(2)}`;
}

function formatModality(modality: string): string {
  return modality.replace(/->/, ' → ').replace(/\+/g, ' + ');
}

export function ModelTable({ models, timestamp }: ModelTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from system preference
  useState(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter((model) => {
      const searchLower = search.toLowerCase();
      const provider = extractProvider(model.id);
      return (
        model.name.toLowerCase().includes(searchLower) ||
        provider.toLowerCase().includes(searchLower) ||
        model.id.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'provider':
          comparison = extractProvider(a.id).localeCompare(extractProvider(b.id));
          break;
        case 'inputPrice':
          comparison = parseFloat(a.pricing.prompt) - parseFloat(b.pricing.prompt);
          break;
        case 'outputPrice':
          comparison = parseFloat(a.pricing.completion) - parseFloat(b.pricing.completion);
          break;
        case 'contextLength':
          comparison = a.context_length - b.context_length;
          break;
        case 'modality':
          comparison = (a.architecture.modality || '').localeCompare(b.architecture.modality || '');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [models, search, sortField, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          type="text"
          placeholder="Search by model name or provider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="shrink-0"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Model Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('provider')}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Provider
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('inputPrice')}
                  className="hover:bg-transparent p-0 h-auto font-semibold w-full justify-end"
                >
                  Input Price/1M
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('outputPrice')}
                  className="hover:bg-transparent p-0 h-auto font-semibold w-full justify-end"
                >
                  Output Price/1M
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('contextLength')}
                  className="hover:bg-transparent p-0 h-auto font-semibold w-full justify-end"
                >
                  Context Window
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('modality')}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Modality
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No models found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedModels.map((model) => {
                const provider = extractProvider(model.id);
                return (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>
                      <Badge className={getProviderColor(provider)}>
                        {provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(model.pricing.prompt)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(model.pricing.completion)}
                    </TableCell>
                    <TableCell className="text-right">
                      {model.context_length.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatModality(model.architecture.modality || 'text')}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredAndSortedModels.length} of {models.length} models • Last updated:{' '}
        {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
}
