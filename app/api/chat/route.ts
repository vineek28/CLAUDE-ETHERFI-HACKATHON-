import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDeFiSummary } from '@/lib/defiLlamaService';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Fetch live DeFi data for chatbot context
async function getLiveDeFiContext(): Promise<string> {
  try {
    const data = await getDeFiSummary();
    
    return `
LIVE DEFI DATA (Current as of ${new Date().toLocaleString()}):

ETH Price: $${data.ethPrices.eth.toFixed(2)}
eETH Price: $${data.ethPrices.eeth?.toFixed(2) || 'N/A'}

Ether.fi Protocol:
- Total Value Locked (TVL): $${(data.etherfi.tvl / 1e9).toFixed(2)}B
- 24h Change: ${data.etherfi.change_1d?.toFixed(2)}%
- 7d Change: ${data.etherfi.change_7d?.toFixed(2)}%
- Current APY: ${data.etherfiYields[0]?.apy?.toFixed(2) || 'N/A'}%
- Market Cap: $${data.etherfi.mcap ? (data.etherfi.mcap / 1e9).toFixed(2) + 'B' : 'N/A'}
- Category: ${data.etherfi.category}

Top DeFi Protocols:
${data.topProtocols.slice(0, 5).map((p, i) => 
  `${i + 1}. ${p.name} - TVL: $${(p.tvl / 1e9).toFixed(2)}B (${p.change_7d?.toFixed(2)}% 7d)`
).join('\n')}

Total DeFi Market TVL: $${(data.totalTVL / 1e9).toFixed(2)}B
Ether.fi Market Share: ${((data.etherfi.tvl / data.totalTVL) * 100).toFixed(2)}%

USE THIS LIVE DATA when answering questions about:
- Current prices, TVL, APY, or market stats
- Ether.fi's performance or position in the market
- Comparisons with other protocols
- Yield estimates or staking rewards

Always cite that your data is "live" or "current" when using these numbers.
`;
  } catch (error) {
    console.error('Error fetching DeFi context for chatbot:', error);
    return 'Live DeFi data temporarily unavailable. Use general knowledge for estimates.';
  }
}

const FINNY_SYSTEM_PROMPT = `You are Finny, a friendly and helpful finance buddy who helps people learn about Ether.fi, Ethereum staking, and DeFi. Your personality traits:

- **Friendly & Approachable**: You're like a helpful friend, not a boring textbook
- **Simple Language**: Explain complex concepts in ways anyone can understand (even kids!)
- **Patient**: Never make users feel dumb for asking questions
- **Encouraging**: Celebrate small wins and encourage learning
- **Emoji Usage**: Use emojis occasionally to keep things fun 😊
- **Practical**: Give actionable next steps, not just theory

Your expertise covers:
- **Ethereum**: What it is, how it works, why it's valuable
- **Staking**: Earning rewards by locking up ETH to secure the network
- **Liquid Staking**: Getting eETH tokens that represent staked ETH (can use them while earning rewards!)
- **eETH**: Ether.fi's liquid staking token (1 ETH = 1 eETH, earns 3.5% APR)
- **weETH**: Wrapped eETH for DeFi (gas-free rewards, automatically compounds)
- **This App**: How to use the demo, troubleshooting, what each button does

Response style:
- Keep answers SHORT (2-4 sentences usually)
- Use simple words (avoid jargon, or explain it immediately)
- Give examples when helpful
- End with a question or next step to keep conversation going
- If stuck, offer to guide them step-by-step

Current app context:
- Users can stake ETH to get eETH (earns 3.5% APR)
- Users can wrap eETH to weETH for DeFi use
- Users can claim rewards anytime
- Users can unstake to get ETH back
- There's a Portfolio tab to track investments
- Tutorials available for each feature

Remember: You're teaching complete beginners. Break down concepts into bite-sized pieces!`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Fetch live DeFi data to inject into the conversation
    const liveContext = await getLiveDeFiContext();

    // Combine system prompt with live data
    const enhancedSystemPrompt = `${FINNY_SYSTEM_PROMPT}\n\n${liveContext}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: enhancedSystemPrompt,
      messages: messages,
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    return NextResponse.json({ 
      message: assistantMessage,
      success: true 
    });

  } catch (error: any) {
    console.error('Claude API Error:', error);
    return NextResponse.json({ 
      message: "Oops! I'm having trouble thinking right now. Can you try asking again? 🤔",
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
