"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Zap,
  Target,
  TrendingDown,
  Award,
} from "lucide-react";

interface UserInsightsProps {
  stakedAmount: number;
  wrappedAmount?: number;
  rewards?: number;
}

interface InsightsData {
  portfolio: {
    totalValueUSD: number;
    stakedValueUSD: number;
    wrappedValueUSD: number;
    rewardsValueUSD: number;
  };
  currentMetrics: {
    apy: number;
    ethPrice: number;
    eethPrice: number;
  };
  projectedRewards: {
    daily: number;
    dailyUSD: number;
    monthly: number;
    monthlyUSD: number;
    yearly: number;
    yearlyUSD: number;
  };
  comparisons: {
    userShareOfProtocol: number;
    apyVsAverage: number;
    isAboveAverage: boolean;
    protocolChange7d: number;
    estimatedPortfolioChange7d: number;
  };
  projections: {
    ifTVLGrows10Percent: {
      estimatedNewYearlyReward: number;
      potentialGainETH: number;
      potentialGainUSD: number;
    };
  };
  insights: string[];
}

export default function UserInsightsPanel({
  stakedAmount,
  wrappedAmount = 0,
  rewards = 0,
}: UserInsightsProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (stakedAmount <= 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stakedAmount, wrappedAmount, rewards }),
      });

      const result = await response.json();

      if (result.success) {
        setInsights(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch insights");
      }
    } catch (err) {
      setError("Network error");
      console.error("Error fetching user insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();

    // Refresh every 2 minutes
    const interval = setInterval(fetchInsights, 120000);
    return () => clearInterval(interval);
  }, [stakedAmount, wrappedAmount, rewards]);

  if (stakedAmount <= 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 backdrop-blur-xl rounded-xl border border-gray-500/30 p-8 text-center">
        <p className="text-gray-400">
          Stake some ETH to see personalized insights! 🚀
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-purple-200">
            Analyzing your portfolio...
          </div>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl rounded-xl border border-red-500/30 p-8 text-center">
        <p className="text-red-200">{error || "Failed to load insights"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl rounded-xl border border-indigo-500/30 p-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />
          Your Personalized Insights
        </h3>
        <p className="text-gray-300 text-sm">
          Live analytics comparing your portfolio with Ether.fi protocol
          performance
        </p>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-300 text-sm">Total Value</p>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${insights.portfolio.totalValueUSD.toFixed(2)}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {stakedAmount.toFixed(4)} ETH staked
          </p>
        </div>

        {/* Current APY */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl rounded-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-300 text-sm">Your APY</p>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {insights.currentMetrics.apy.toFixed(2)}%
          </p>
          <div className="flex items-center gap-1 mt-1">
            {insights.comparisons.isAboveAverage ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <p
              className={`text-sm ${
                insights.comparisons.isAboveAverage
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {Math.abs(insights.comparisons.apyVsAverage).toFixed(2)}% vs avg
            </p>
          </div>
        </div>

        {/* Monthly Rewards */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-300 text-sm">Monthly Rewards</p>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {insights.projectedRewards.monthly.toFixed(4)} ETH
          </p>
          <p className="text-sm text-gray-300 mt-1">
            ≈ ${insights.projectedRewards.monthlyUSD.toFixed(2)}
          </p>
        </div>

        {/* Yearly Rewards */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-300 text-sm">Yearly Rewards</p>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {insights.projectedRewards.yearly.toFixed(4)} ETH
          </p>
          <p className="text-sm text-gray-300 mt-1">
            ≈ ${insights.projectedRewards.yearlyUSD.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detailed Projections */}
      <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl border border-violet-500/30 p-6">
        <h4 className="text-xl font-bold text-white mb-4">
          Growth Projections
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Performance */}
          <div>
            <p className="text-gray-400 text-sm mb-3">
              7-Day Performance Impact
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Protocol TVL Change:</span>
                <span
                  className={`font-semibold ${
                    insights.comparisons.protocolChange7d >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {insights.comparisons.protocolChange7d >= 0 ? "+" : ""}
                  {insights.comparisons.protocolChange7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Est. Portfolio Impact:</span>
                <span
                  className={`font-semibold ${
                    insights.comparisons.estimatedPortfolioChange7d >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  $
                  {Math.abs(
                    insights.comparisons.estimatedPortfolioChange7d
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Future Projections */}
          <div>
            <p className="text-gray-400 text-sm mb-3">
              If Protocol TVL Grows 10%
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">New Yearly Reward:</span>
                <span className="font-semibold text-green-400">
                  {insights.projections.ifTVLGrows10Percent.estimatedNewYearlyReward.toFixed(
                    4
                  )}{" "}
                  ETH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Additional Gain:</span>
                <span className="font-semibold text-yellow-400">
                  +
                  {insights.projections.ifTVLGrows10Percent.potentialGainETH.toFixed(
                    4
                  )}{" "}
                  ETH
                  <span className="text-xs text-gray-400 ml-1">
                    ($
                    {insights.projections.ifTVLGrows10Percent.potentialGainUSD.toFixed(
                      2
                    )}
                    )
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
        <h4 className="text-xl font-bold text-white mb-4">Smart Insights</h4>
        <div className="space-y-3">
          {insights.insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-200">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Share */}
      <div className="bg-gradient-to-br from-slate-900/30 to-gray-900/30 backdrop-blur-xl rounded-xl border border-slate-500/30 p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">
          Your Share of Ether.fi Protocol
        </p>
        <p className="text-3xl font-bold text-white">
          {insights.comparisons.userShareOfProtocol < 0.01
            ? "<0.01"
            : insights.comparisons.userShareOfProtocol.toFixed(4)}
          %
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Keep staking to grow your position! 🚀
        </p>
      </div>
    </div>
  );
}
