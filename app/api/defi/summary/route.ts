import { NextResponse } from 'next/server';
import { getDeFiSummary } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const summary = await getDeFiSummary();
    
    return NextResponse.json({
      success: true,
      data: summary,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/defi/summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch DeFi summary',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
