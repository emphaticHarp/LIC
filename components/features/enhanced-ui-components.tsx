"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Grid3x3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";

interface EnhancedTableProps {
  data: any[];
  columns: any[];
  title: string;
  description?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
}

interface DataCard {
  id: string;
  title: string;
  subtitle?: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  color?: string;
  actions?: React.ReactNode[];
}

export function EnhancedDataTable({ 
  data, 
  columns, 
  title, 
  description, 
  searchable = true, 
  filterable = true, 
  sortable = true, 
  exportable = true,
  selectable = false 
}: EnhancedTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      columns.some(col => 
        item[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => 
      !value || item[key]?.toString().toLowerCase().includes(value.toLowerCase())
    );
    
    return matchesSearch && matchesFilters;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    const dataToExport = selectedRows.length > 0 
      ? sortedData.filter(item => selectedRows.includes(item.id))
      : sortedData;
    
    if (format === 'csv') {
      const csv = [
        columns.map(col => col.label).join(','),
        ...dataToExport.map(item => columns.map(col => item[col.key]).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
      a.click();
    } else {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.json`;
      a.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {selectable && (
              <Badge variant="outline">
                {selectedRows.length} selected
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {filterable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
              
              {exportable && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                    <Download className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {sortedData.length} of {data.length} results
            </div>
          </div>
          
          {showFilters && filterable && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              {columns.filter(col => col.filterable).map(col => (
                <div key={col.key}>
                  <label className="text-sm font-medium mb-1 block">{col.label}</label>
                  <Select
                    value={filters[col.key] || ''}
                    onValueChange={(value) => setFilters({ ...filters, [col.key]: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Filter by ${col.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {Array.from(new Set(data.map(item => item[col.key]))).map(value => (
                        <SelectItem key={value} value={value.toString()}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {selectable && (
                    <th className="text-left p-2">
                      <Checkbox
                        checked={selectedRows.length === sortedData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                  )}
                  {columns.map(col => (
                    <th 
                      key={col.key} 
                      className="text-left p-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortable && sortField === col.key && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {selectable && (
                      <td className="p-2">
                        <Checkbox
                          checked={selectedRows.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className="p-2">
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedData.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.name || item.title}</h3>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {columns.slice(0, 3).map(col => (
                      <div key={col.key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{col.label}:</span>
                        <span>{col.render ? col.render(item[col.key], item) : item[col.key]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DataCards({ cards }: { cards: DataCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map(card => (
        <Card key={card.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.color || 'bg-blue-100'}`}>
                {card.icon}
              </div>
              {card.change && (
                <Badge 
                  variant={card.trend === 'up' ? 'default' : 'destructive'}
                  className="flex items-center gap-1"
                >
                  {card.trend === 'up' ? '↑' : '↓'} {Math.abs(card.change)}%
                </Badge>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{card.value}</h3>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              )}
            </div>
            {card.actions && (
              <div className="flex items-center gap-2 mt-4">
                {card.actions.map((action, index) => (
                  <Button key={index} variant="outline" size="sm">
                    {action}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function BulkActions({ 
  selectedItems, 
  actions, 
  onClear 
}: { 
  selectedItems: string[];
  actions: Array<{ label: string; action: () => void; variant?: 'default' | 'destructive' }>;
  onClear: () => void;
}) {
  if (selectedItems.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedItems.length} items selected
            </span>
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear selection
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
