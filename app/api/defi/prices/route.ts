import { NextResponse } from 'next/server';
import { getEthereumPrices, getCurrentPrices } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coins = searchParams.get('coins');
    
    if (coins) {
      // Custom coins requested
      const coinsList = coins.split(',');
      const prices = await getCurrentPrices(coinsList);
      
      return NextResponse.json({
        success: true,
        data: prices,
        timestamp: Date.now(),
      });
    } else {
      // Default: ETH and eETH prices
      const prices = await getEthereumPrices();
      
      return NextResponse.json({
        success: true,
        data: prices,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error in /api/defi/prices:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
