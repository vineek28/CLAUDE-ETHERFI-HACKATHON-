"use client";

import React, { useState, useEffect } from "react";
import LiveDeFiDashboard from "@/components/LiveDeFiDashboard";
import UserInsightsPanel from "@/components/UserInsightsPanel";
import { Web3Provider, useWeb3 } from "@/contexts/Web3Context";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { ethers } from "ethers";

function AnalyticsContent() {
  const { account, contracts } = useWeb3();
  const [showUserInsights, setShowUserInsights] = useState(true);
  const [stakedBalance, setStakedBalance] = useState("0");
  const [wrappedBalance, setWrappedBalance] = useState("0");
  const [rewardsEarned, setRewardsEarned] = useState("0");

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!account || !contracts.eeth || !contracts.weeth) return;

      try {
        // Get eETH balance (staked)
        const eethBal = await contracts.eeth.balanceOf(account);
        setStakedBalance(ethers.formatEther(eethBal));

        // Get weETH balance (wrapped)
        const weethBal = await contracts.weeth.balanceOf(account);
        setWrappedBalance(ethers.formatEther(weethBal));

        // Get rewards earned (simplified - you may need to adjust based on your contract)
        try {
          const rewards = await contracts.lender?.getPendingRewards(account);
          if (rewards) {
            setRewardsEarned(ethers.formatEther(rewards));
          }
        } catch (e) {
          // If getPendingRewards doesn't exist, keep at 0
          setRewardsEarned("0");
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [account, contracts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <BarChart3 className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DeFi Analytics Hub
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Real-time protocol metrics, market data, and personalized portfolio
            insights powered by DeFiLlama
          </p>
        </div>

        {/* Toggle for User Insights */}
        {parseFloat(stakedBalance) > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowUserInsights(!showUserInsights)}
              className="px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg text-indigo-200 transition"
            >
              {showUserInsights ? "Hide" : "Show"} My Portfolio Insights
            </button>
          </div>
        )}

        {/* User Insights Panel */}
        {showUserInsights && parseFloat(stakedBalance) > 0 && (
          <div className="mb-8">
            <UserInsightsPanel
              stakedAmount={parseFloat(stakedBalance)}
              wrappedAmount={parseFloat(wrappedBalance)}
              rewards={parseFloat(rewardsEarned)}
            />
          </div>
        )}

        {/* Live DeFi Dashboard */}
        <LiveDeFiDashboard userStakedAmount={parseFloat(stakedBalance)} />

        {/* Footer Info */}
        <div className="mt-12 bg-gradient-to-br from-gray-900/50 to-slate-900/50 backdrop-blur-xl rounded-xl border border-gray-500/30 p-6 text-center">
          <p className="text-gray-400 text-sm">
            Data sourced from{" "}
            <strong className="text-purple-300">DeFiLlama API</strong> • Updates
            every 60 seconds • 100% Free & Open Data
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Visit{" "}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              defillama.com
            </a>{" "}
            for more DeFi analytics
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Web3Provider>
      <AnalyticsContent />
    </Web3Provider>
  );
}
