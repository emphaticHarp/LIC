"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalogClock() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: now.getHours() % 12,
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  // Calculate rotation angles
  const secondsAngle = time.seconds * 6;
  const minutesAngle = time.minutes * 6 + time.seconds * 0.1;
  const hoursAngle = time.hours * 30 + time.minutes * 0.5;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Analog Clock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
            {/* Clock face */}
            <circle cx="100" cy="100" r="95" fill="white" stroke="#2563eb" strokeWidth="8" />

            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = 100 + 85 * Math.cos(angle);
              const y1 = 100 + 85 * Math.sin(angle);
              const x2 = 100 + 75 * Math.cos(angle);
              const y2 = 100 + 75 * Math.sin(angle);
              return (
                <line
                  key={`marker-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              );
            })}

            {/* Numbers */}
            {[...Array(12)].map((_, i) => {
              const num = i === 0 ? 12 : i;
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x = 100 + 65 * Math.cos(angle);
              const y = 100 + 65 * Math.sin(angle);
              return (
                <text
                  key={`num-${num}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#1e3a8a"
                >
                  {num}
                </text>
              );
            })}

            {/* Hour hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 40 * Math.cos((hoursAngle - 90) * (Math.PI / 180))}
              y2={100 + 40 * Math.sin((hoursAngle - 90) * (Math.PI / 180))}
              stroke="#1e3a8a"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Minute hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.cos((minutesAngle - 90) * (Math.PI / 180))}
              y2={100 + 60 * Math.sin((minutesAngle - 90) * (Math.PI / 180))}
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Second hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 70 * Math.cos((secondsAngle - 90) * (Math.PI / 180))}
              y2={100 + 70 * Math.sin((secondsAngle - 90) * (Math.PI / 180))}
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill="#2563eb" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
