"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Moon, CloudSnow, Wind, Droplets, Eye, Thermometer } from "lucide-react";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "61113cc0e8434935b0571556250312";
  const LOCATION = "Agartala";

  useEffect(() => {
    fetchWeatherData();
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Current weather
      const currentResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}&aqi=no`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather');
      }

      const currentData = await currentResponse.json();

      // Forecast (3 days)
      const forecastResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=3&aqi=no&alerts=no`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const forecastData = await forecastResponse.json();

      setWeather(currentData);
      setForecast(forecastData.forecast.forecastday);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Unable to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string, isDay: number) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return isDay ? <Sun className="w-8 h-8 text-yellow-500" /> : <Moon className="w-8 h-8 text-blue-300" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (lowerCondition.includes('snow') || lowerCondition.includes('sleet')) {
      return <CloudSnow className="w-8 h-8 text-gray-400" />;
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    } else {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getBackgroundGradient = (condition: string, isDay: number) => {
    const lowerCondition = condition.toLowerCase();
    
    if (isDay === 0) {
      return 'bg-gradient-to-br from-indigo-900 to-purple-900';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return 'bg-gradient-to-br from-gray-600 to-gray-800';
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
    } else if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) {
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    } else {
      return 'bg-gradient-to-br from-blue-500 to-blue-700';
    }
  };

  const getTimeOfDay = () => {
    if (!weather) return '';
    const hour = new Date(weather.location.localtime).getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather - Agartala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather - Agartala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{error}</p>
            <button 
              onClick={fetchWeatherData}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather - Agartala
          </CardTitle>
          <CardDescription>
            {weather.location.name}, {weather.location.region}, {weather.location.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-lg ${getBackgroundGradient(weather.current.condition.text, weather.current.is_day)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <div className="text-3xl font-bold">
                  {Math.round(weather.current.temp_c)}°C
                </div>
                <div className="text-sm opacity-90">
                  Feels like {Math.round(weather.current.feelslike_c)}°C
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {getTimeOfDay()} • {weather.location.localtime.split(' ')[1]}
                </div>
              </div>
              <div className="text-white">
                {getWeatherIcon(weather.current.condition.text, weather.current.is_day)}
              </div>
            </div>
            
            <div className="text-white text-sm font-medium mb-3">
              {weather.current.condition.text}
            </div>

            <div className="grid grid-cols-3 gap-3 text-white text-xs">
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{weather.current.wind_kph} km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{weather.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{weather.current.vis_km} km</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600">UV Index</div>
              <div className="text-lg font-semibold text-blue-600">{weather.current.uv}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-600">Pressure</div>
              <div className="text-lg font-semibold text-green-600">{weather.current.pressure_mb} mb</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>3-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium w-20">
                    {index === 0 ? 'Today' : 
                     index === 1 ? 'Tomorrow' : 
                     new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                  </div>
                  {getWeatherIcon(day.day.condition.text, 1)}
                  <div className="text-sm">
                    <div className="font-medium">{day.day.condition.text}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                  </div>
                  <div className="text-xs text-gray-500">
                    H / L
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {lastUpdated.toLocaleTimeString('en-IN')}</span>
            <Badge variant="outline" className="text-xs">
              {weather.current.is_day ? 'Day' : 'Night'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
