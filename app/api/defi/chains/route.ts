import { NextResponse } from 'next/server';
import { getAllChainsTVL } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const chains = await getAllChainsTVL();
    
    return NextResponse.json({
      success: true,
      data: chains,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/defi/chains:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch chain data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
