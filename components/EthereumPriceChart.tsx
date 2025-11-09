"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface PricePoint {
  timestamp: number;
  price: number;
}

interface EthHistoryData {
  success: boolean;
  period: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  dataPoints: number;
  history: PricePoint[];
  timestamp: string;
  fallback?: boolean;
  message?: string;
}

type TimePeriod = "24h" | "7d" | "30d" | "90d" | "1y";

const EthereumPriceChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("7d");
  const [data, setData] = useState<EthHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPriceHistory();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchPriceHistory, 60000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/defi/eth-history?period=${selectedPeriod}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch price history");
      }

      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        throw new Error(result.error || "Failed to load data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching ETH price history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (selectedPeriod === "24h") {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-blue-500 p-3 rounded-lg shadow-lg">
          <p className="text-white font-semibold">{formatPrice(point.price)}</p>
          <p className="text-gray-400 text-sm">
            {new Date(point.timestamp).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Ethereum Price</h3>
          {data && (
            <div>
              <div className="text-4xl font-bold text-white mb-1">
                {formatPrice(data.currentPrice)}
              </div>
              <div
                className={`text-lg font-semibold ${
                  data.priceChangePercent >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {data.priceChangePercent >= 0 ? "▲" : "▼"}{" "}
                {formatPrice(Math.abs(data.priceChange))} (
                {Math.abs(data.priceChangePercent).toFixed(2)}%)
                <span className="text-gray-400 text-sm ml-2">
                  Past {selectedPeriod}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                selectedPeriod === period.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fallback Warning */}
      {data && data.fallback && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
          <p className="text-yellow-300 text-sm flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {data.message ||
              "Historical data temporarily unavailable. Try a shorter time period."}
          </p>
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Loading price data...
          </div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-400">
            <p className="font-semibold mb-2">Error loading chart</p>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={fetchPriceHistory}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : data && data.history.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data.history}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ethGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#ethGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No price data available
        </div>
      )}

      {/* Footer Info */}
      {data && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Data Points: {data.dataPoints}</span>
            <span>
              Last Updated: {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthereumPriceChart;
