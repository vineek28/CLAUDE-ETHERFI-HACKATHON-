"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Zap,
  Shield,
} from "lucide-react";
import EthereumPriceChart from "./EthereumPriceChart";

interface DeFiMetrics {
  etherfi: any;
  ethPrices: {
    eth: number;
    eeth: number | null;
  };
  etherfiYields: any[];
  topProtocols: any[];
  totalTVL: number;
}

interface LiveDashboardProps {
  userStakedAmount?: number; // User's staked ETH amount
}

export default function LiveDeFiDashboard({
  userStakedAmount = 0,
}: LiveDashboardProps) {
  const [metrics, setMetrics] = useState<DeFiMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/defi/summary");
      const result = await response.json();

      if (result.success) {
        setMetrics(result.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error - unable to fetch DeFi data");
      console.error("Error fetching DeFi metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Auto-refresh every 60 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatNumber = (num: number, decimals = 2): string => {
    // Handle null, undefined, or non-number values
    if (num === null || num === undefined || isNaN(num)) return "$0.00";

    const numValue = Number(num);
    if (numValue >= 1e9) return `$${(numValue / 1e9).toFixed(decimals)}B`;
    if (numValue >= 1e6) return `$${(numValue / 1e6).toFixed(decimals)}M`;
    if (numValue >= 1e3) return `$${(numValue / 1e3).toFixed(decimals)}K`;
    return `$${numValue.toFixed(decimals)}`;
  };

  const formatPercentage = (num: number | null): string => {
    if (num === null || num === undefined || isNaN(num)) return "N/A";
    const sign = num >= 0 ? "+" : "";
    return `${sign}${Number(num).toFixed(2)}%`;
  };

  const getChangeIcon = (change: number | null) => {
    if (change === null || change === undefined) return null;
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeColor = (change: number | null): string => {
    if (change === null || change === undefined) return "text-gray-400";
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  // Calculate user insights
  const calculateUserInsights = () => {
    if (!metrics || !userStakedAmount) return null;

    const etherfiAPY = metrics.etherfiYields[0]?.apy || 0;
    const estimatedYearlyReward = (userStakedAmount * etherfiAPY) / 100;
    const currentValue =
      userStakedAmount * (metrics.ethPrices.eeth || metrics.ethPrices.eth);

    return {
      apy: etherfiAPY,
      estimatedYearlyReward,
      currentValue,
    };
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
        <div className="flex items-center justify-center space-x-3">
          <Activity className="w-6 h-6 text-purple-400 animate-pulse" />
          <p className="text-purple-200">Loading live DeFi analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8">
        <div className="text-center">
          <p className="text-red-200 mb-4">{error || "Failed to load data"}</p>
          <button
            onClick={fetchMetrics}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userInsights = calculateUserInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Live DeFi Analytics
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time data from DeFiLlama • Last update:{" "}
            {lastUpdate?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg border transition ${
              autoRefresh
                ? "bg-green-500/20 border-green-500/50 text-green-200"
                : "bg-gray-500/20 border-gray-500/50 text-gray-300"
            }`}
          >
            Auto-refresh: {autoRefresh ? "ON" : "OFF"}
          </button>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-200 transition"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Ethereum Price Chart - Featured Section */}
      <EthereumPriceChart />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ETH Price */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">ETH Price</p>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${(metrics.ethPrices?.eth || 0).toFixed(2)}
          </p>
        </div>

        {/* eETH Price */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">eETH Price</p>
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            $
            {metrics.ethPrices?.eeth
              ? metrics.ethPrices.eeth.toFixed(2)
              : "N/A"}
          </p>
        </div>

        {/* Ether.fi TVL */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Ether.fi TVL</p>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {formatNumber(metrics.etherfi.tvl || 0)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {getChangeIcon(metrics.etherfi.change_7d)}
            <span
              className={`text-sm ${getChangeColor(metrics.etherfi.change_7d)}`}
            >
              {formatPercentage(metrics.etherfi.change_7d)} (7d)
            </span>
          </div>
        </div>

        {/* APY */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Current APY</p>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {(metrics.etherfiYields?.[0]?.apy || 0).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* User Personalized Insights */}
      {userStakedAmount > 0 && userInsights && (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl rounded-xl border border-indigo-500/30 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Your Portfolio Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Your Staked Amount</p>
              <p className="text-2xl font-bold text-white">
                {userStakedAmount.toFixed(4)} ETH
              </p>
              <p className="text-sm text-gray-300 mt-1">
                ≈ {formatNumber(userInsights.currentValue)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Current APY</p>
              <p className="text-2xl font-bold text-green-400">
                {userInsights.apy.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-300 mt-1">Live protocol rate</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Est. Yearly Rewards</p>
              <p className="text-2xl font-bold text-yellow-400">
                {userInsights.estimatedYearlyReward.toFixed(4)} ETH
              </p>
              <p className="text-sm text-gray-300 mt-1">
                ≈{" "}
                {formatNumber(
                  userInsights.estimatedYearlyReward * metrics.ethPrices.eth
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ether.fi Detailed Stats */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Ether.fi Protocol Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">24h Change</p>
            <div className="flex items-center gap-2">
              {getChangeIcon(metrics.etherfi.change_1d)}
              <p
                className={`text-xl font-bold ${getChangeColor(
                  metrics.etherfi.change_1d
                )}`}
              >
                {formatPercentage(metrics.etherfi.change_1d)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">7d Change</p>
            <div className="flex items-center gap-2">
              {getChangeIcon(metrics.etherfi.change_7d)}
              <p
                className={`text-xl font-bold ${getChangeColor(
                  metrics.etherfi.change_7d
                )}`}
              >
                {formatPercentage(metrics.etherfi.change_7d)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Market Cap</p>
            <p className="text-xl font-bold text-white">
              {metrics.etherfi.mcap
                ? formatNumber(metrics.etherfi.mcap)
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Category</p>
            <p className="text-xl font-bold text-purple-300">
              {metrics.etherfi.category}
            </p>
          </div>
        </div>
      </div>

      {/* Top DeFi Protocols */}
      <div className="bg-gradient-to-br from-slate-900/30 to-gray-900/30 backdrop-blur-xl rounded-xl border border-slate-500/30 p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Top DeFi Protocols by TVL
        </h3>
        <div className="space-y-3">
          {metrics.topProtocols.slice(0, 5).map((protocol, index) => (
            <div
              key={protocol.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-500">
                  #{index + 1}
                </span>
                {protocol.logo && (
                  <img
                    src={protocol.logo}
                    alt={protocol.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-white">{protocol.name}</p>
                  <p className="text-sm text-gray-400">{protocol.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">
                  {formatNumber(protocol.tvl)}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {getChangeIcon(protocol.change_7d)}
                  <span
                    className={`text-sm ${getChangeColor(protocol.change_7d)}`}
                  >
                    {formatPercentage(protocol.change_7d)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total DeFi Market */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Total DeFi Market TVL</p>
        <p className="text-4xl font-bold text-white">
          {formatNumber(metrics.totalTVL || 0)}
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Ether.fi represents{" "}
          {(
            ((metrics.etherfi?.tvl || 0) / (metrics.totalTVL || 1)) *
            100
          ).toFixed(2)}
          % of total market
        </p>
      </div>
    </div>
  );
}
