import { NextResponse } from 'next/server';
import { getDeFiSummary } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface UserPortfolio {
  stakedAmount: number;
  wrappedAmount: number;
  rewards: number;
}

export async function POST(request: Request) {
  try {
    const { stakedAmount, wrappedAmount, rewards } = await request.json();

    if (!stakedAmount || stakedAmount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid staked amount',
      }, { status: 400 });
    }

    // Fetch live DeFi data
    const defiData = await getDeFiSummary();

    // Calculate user-specific insights
    const currentAPY = defiData.etherfiYields[0]?.apy || 0;
    const ethPrice = defiData.ethPrices.eth;
    const eethPrice = defiData.ethPrices.eeth || ethPrice;

    // Portfolio values
    const stakedValueUSD = stakedAmount * eethPrice;
    const wrappedValueUSD = (wrappedAmount || 0) * eethPrice;
    const rewardsValueUSD = (rewards || 0) * ethPrice;
    const totalValueUSD = stakedValueUSD + wrappedValueUSD + rewardsValueUSD;

    // Estimated rewards
    const dailyReward = (stakedAmount * currentAPY) / 100 / 365;
    const monthlyReward = dailyReward * 30;
    const yearlyReward = (stakedAmount * currentAPY) / 100;

    // Protocol comparison
    const etherfiTVL = defiData.etherfi.tvl;
    const userShareOfProtocol = (totalValueUSD / etherfiTVL) * 100;

    // Performance insights
    const protocolChange7d = defiData.etherfi.change_7d || 0;
    const estimatedPortfolioChange7d = (totalValueUSD * protocolChange7d) / 100;

    // APY comparison with average
    const averageYield = defiData.etherfiYields.reduce((sum, pool) => sum + pool.apy, 0) / 
                        (defiData.etherfiYields.length || 1);
    const apyVsAverage = currentAPY - averageYield;

    // Growth projection if TVL increases
    const projectedTVLIncrease10 = etherfiTVL * 1.1;
    const estimatedRewardIncrease = yearlyReward * 0.05; // Conservative 5% boost

    const insights = {
      portfolio: {
        stakedAmount,
        wrappedAmount: wrappedAmount || 0,
        rewards: rewards || 0,
        stakedValueUSD,
        wrappedValueUSD,
        rewardsValueUSD,
        totalValueUSD,
      },
      currentMetrics: {
        apy: currentAPY,
        ethPrice,
        eethPrice,
        etherfiTVL,
      },
      projectedRewards: {
        daily: dailyReward,
        dailyUSD: dailyReward * ethPrice,
        monthly: monthlyReward,
        monthlyUSD: monthlyReward * ethPrice,
        yearly: yearlyReward,
        yearlyUSD: yearlyReward * ethPrice,
      },
      comparisons: {
        userShareOfProtocol,
        apyVsAverage,
        isAboveAverage: apyVsAverage > 0,
        protocolChange7d,
        estimatedPortfolioChange7d,
      },
      projections: {
        ifTVLGrows10Percent: {
          newTVL: projectedTVLIncrease10,
          estimatedNewYearlyReward: yearlyReward + estimatedRewardIncrease,
          potentialGainETH: estimatedRewardIncrease,
          potentialGainUSD: estimatedRewardIncrease * ethPrice,
        },
      },
      insights: [
        currentAPY > averageYield 
          ? `Your current APY (${currentAPY.toFixed(2)}%) is ${Math.abs(apyVsAverage).toFixed(2)}% above the protocol average! 🎉`
          : `Your current APY (${currentAPY.toFixed(2)}%) is ${Math.abs(apyVsAverage).toFixed(2)}% below the protocol average.`,
        
        protocolChange7d > 0
          ? `Ether.fi's TVL grew ${protocolChange7d.toFixed(2)}% in the last 7 days, potentially increasing your rewards by ~$${Math.abs(estimatedPortfolioChange7d).toFixed(2)}.`
          : `Ether.fi's TVL changed ${protocolChange7d.toFixed(2)}% in the last 7 days.`,
        
        `You own ${userShareOfProtocol < 0.01 ? '<0.01' : userShareOfProtocol.toFixed(4)}% of the total Ether.fi protocol TVL.`,
        
        `If Ether.fi's TVL grows by 10%, your estimated yearly reward could increase by ${estimatedRewardIncrease.toFixed(4)} ETH ($${(estimatedRewardIncrease * ethPrice).toFixed(2)}).`,
      ],
    };

    return NextResponse.json({
      success: true,
      data: insights,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Error in /api/user/insights:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate user insights',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
