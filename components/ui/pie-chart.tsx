"use client"

import { useState, useEffect } from "react"

interface PieChartProps {
  data: { label: string; value: number; color: string }[]
  title: string
}

export function PieChart({ data, title }: PieChartProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              if (item.value === 0) return null;
              
              const percentage = item.value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 100 + 90 * Math.cos(startAngleRad);
              const y1 = 100 + 90 * Math.sin(startAngleRad);
              const x2 = 100 + 90 * Math.cos(endAngleRad);
              const y2 = 100 + 90 * Math.sin(endAngleRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              currentAngle = endAngle;
              
              return (
                <path
                  key={`${item.label}-${index}`}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.label}</span>
            </div>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
