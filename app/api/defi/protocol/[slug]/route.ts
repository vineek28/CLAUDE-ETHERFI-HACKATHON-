import { NextResponse } from 'next/server';
import { getProtocol } from '@/lib/defiLlamaService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const protocol = await getProtocol(slug);
    
    return NextResponse.json({
      success: true,
      data: protocol,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in /api/defi/protocol:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch protocol data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
