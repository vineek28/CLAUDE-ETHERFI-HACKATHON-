import { NextResponse } from 'next/server';
import { getEtherfiYields, getYieldPools } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const protocol = searchParams.get('protocol');
    
    if (protocol === 'ether.fi' || protocol === 'etherfi') {
      const yields = await getEtherfiYields();
      
      return NextResponse.json({
        success: true,
        data: yields,
        timestamp: Date.now(),
      });
    } else {
      // All yield pools
      const yields = await getYieldPools();
      
      return NextResponse.json({
        success: true,
        data: yields.data,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error in /api/defi/yields:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch yield data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
