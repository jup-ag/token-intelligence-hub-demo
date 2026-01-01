"use client";

import { useState, useEffect, useRef } from "react";
import { getHistoricalPrices } from "@/lib/coingecko";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface PriceChartProps {
  mint: string;
  symbol?: string;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

/**
 * Clean Chart.js line chart inspired by zecprice.com
 * 
 * - Chart.js for smooth rendering and tooltips
 * - Free USD price data from DeFi Llama
 * - Minimal aesthetic: single line, hidden axes
 * - Smooth hover tooltips
 */
export function PriceChart({ mint }: PriceChartProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const history = await getHistoricalPrices(mint, 1); // 24 hours
      setData(history);
      setIsLoading(false);
    }
    fetchData();
  }, [mint]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="size-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-white/20 text-sm">No chart data available</p>
      </div>
    );
  }

  // Determine if overall trend is up or down
  const isUp = data[data.length - 1].price >= data[0].price;
  const lineColor = isUp ? "#30D158" : "#FF453A";

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        data: data.map((d) => d.price),
        borderColor: lineColor,
        borderWidth: 1.5,
        fill: true,
        backgroundColor: (context: { chart: ChartJS }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "transparent";
          
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, isUp ? "rgba(48, 209, 88, 0.15)" : "rgba(255, 69, 58, 0.15)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          return gradient;
        },
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        titleColor: "rgba(255, 255, 255, 0.5)",
        bodyColor: "#fff",
        titleFont: { 
          family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
          size: 11, 
          weight: 400 as const,
        },
        bodyFont: { 
          family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
          size: 14, 
          weight: 500 as const,
        },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          title: (items: TooltipItem<"line">[]) => {
            const date = new Date(items[0]?.parsed?.x ?? 0);
            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          },
          label: (item: TooltipItem<"line">) => {
            const price = item.parsed?.y ?? 0;
            const decimals = price < 1 ? 6 : price < 100 ? 4 : 2;
            return (
              "$" +
              price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: decimals,
              })
            );
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
    animation: {
      duration: 400,
      easing: "easeOutQuart" as const,
    },
  };

  return (
    <div className="w-full h-[300px] relative">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
