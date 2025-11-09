/**
 * DeFiLlama API Service
 * Free API endpoints - no authentication required
 * Documentation: https://api-docs.defillama.com/
 */

const BASE_URL = 'https://api.llama.fi';
const COINS_URL = 'https://coins.llama.fi';
const YIELDS_URL = 'https://yields.llama.fi';

// Cache configuration
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

interface CacheEntry {
  data: any;
  timestamp: number;
}

/**
 * Generic fetch with caching
 */
async function fetchWithCache<T>(key: string, url: string): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(key, { data, timestamp: now });
    return data as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    // Return cached data if available, even if stale
    if (cached) {
      return cached.data as T;
    }
    throw error;
  }
}

/**
 * Protocol Data Types
 */
export interface Protocol {
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  methodology: string;
  slug: string;
  tvl: number;
  chainTvls: { [chain: string]: number };
  change_1h: number | null;
  change_1d: number | null;
  change_7d: number | null;
  fdv: number | null;
  mcap: number | null;
}

export interface ProtocolHistoricalTVL {
  date: number;
  totalLiquidityUSD: number;
}

export interface ChainTVL {
  gecko_id: string | null;
  tvl: number;
  tokenSymbol: string | null;
  cmcId: string | null;
  name: string;
  chainId: number | null;
}

export interface TokenPrice {
  decimals: number;
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
}

export interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  pool: string;
  apyPct1D: number | null;
  apyPct7D: number | null;
  apyPct30D: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  predictions: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  } | null;
}

/**
 * TVL Data - Get all protocols with their TVL
 */
export async function getAllProtocols(): Promise<Protocol[]> {
  return fetchWithCache('all-protocols', `${BASE_URL}/protocols`);
}

/**
 * Get specific protocol data with historical TVL
 */
export async function getProtocol(slug: string): Promise<any> {
  return fetchWithCache(`protocol-${slug}`, `${BASE_URL}/protocol/${slug}`);
}

/**
 * Get Ether.fi specific data
 */
export async function getEtherfiData(): Promise<any> {
  return getProtocol('ether.fi');
}

/**
 * Get TVL for all chains
 */
export async function getAllChainsTVL(): Promise<ChainTVL[]> {
  return fetchWithCache('all-chains-tvl', `${BASE_URL}/v2/chains`);
}

/**
 * Get historical TVL for a specific chain
 */
export async function getChainHistoricalTVL(chain: string): Promise<any> {
  return fetchWithCache(
    `chain-tvl-${chain}`,
    `${BASE_URL}/v2/historicalChainTvl/${chain}`
  );
}

/**
 * Get current token prices
 * coins format: "ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,ethereum:0x..."
 */
export async function getCurrentPrices(
  coins: string[]
): Promise<{ coins: { [key: string]: TokenPrice } }> {
  const coinsParam = coins.join(',');
  return fetchWithCache(
    `prices-${coinsParam}`,
    `${COINS_URL}/prices/current/${coinsParam}`
  );
}

/**
 * Get ETH and eETH prices
 */
export async function getEthereumPrices(): Promise<{
  eth: number;
  eeth: number | null;
}> {
  try {
    // ETH: Wrapped Ethereum
    // eETH: Ether.fi Staked ETH
    const coins = [
      'ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
      'ethereum:0x35fA164735182de50811E8e2E824cFb9B6118ac2', // eETH
    ];

    const data = await getCurrentPrices(coins);
    const ethPrice =
      data.coins['ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2']?.price || 0;
    const eethPrice =
      data.coins['ethereum:0x35fA164735182de50811E8e2E824cFb9B6118ac2']?.price || null;

    return {
      eth: ethPrice,
      eeth: eethPrice,
    };
  } catch (error) {
    console.error('Error fetching Ethereum prices:', error);
    return { eth: 0, eeth: null };
  }
}

/**
 * Get historical prices
 */
export async function getHistoricalPrices(
  timestamp: number,
  coins: string[]
): Promise<{ coins: { [key: string]: TokenPrice } }> {
  const coinsParam = coins.join(',');
  return fetchWithCache(
    `historical-prices-${timestamp}-${coinsParam}`,
    `${COINS_URL}/prices/historical/${timestamp}/${coinsParam}`
  );
}

/**
 * Get yield pools data
 */
export async function getYieldPools(): Promise<{ data: YieldPool[] }> {
  return fetchWithCache('yield-pools', `${YIELDS_URL}/pools`);
}

/**
 * Get Ether.fi yield data
 */
export async function getEtherfiYields(): Promise<YieldPool[]> {
  try {
    const data = await getYieldPools();
    return data.data.filter((pool) =>
      pool.project.toLowerCase().includes('ether.fi')
    );
  } catch (error) {
    console.error('Error fetching Ether.fi yields:', error);
    return [];
  }
}

/**
 * Get protocol fees and revenue
 */
export async function getProtocolFees(protocol?: string): Promise<any> {
  const url = protocol
    ? `${BASE_URL}/overview/fees/${protocol}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees`
    : `${BASE_URL}/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`;
  
  return fetchWithCache(`fees-${protocol || 'all'}`, url);
}

/**
 * Get DeFi summary for dashboard
 */
export async function getDeFiSummary(): Promise<{
  etherfi: any;
  ethPrices: { eth: number; eeth: number | null };
  etherfiYields: YieldPool[];
  topProtocols: Protocol[];
  totalTVL: number;
}> {
  try {
    const [etherfi, ethPrices, etherfiYields, allProtocols] = await Promise.all([
      getEtherfiData(),
      getEthereumPrices(),
      getEtherfiYields(),
      getAllProtocols(),
    ]);

    // Sort by TVL and get top 10
    const topProtocols = allProtocols
      .sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
      .slice(0, 10);

    // Calculate total TVL across all protocols
    const totalTVL = allProtocols.reduce((sum, p) => sum + (p.tvl || 0), 0);

    return {
      etherfi,
      ethPrices,
      etherfiYields,
      topProtocols,
      totalTVL,
    };
  } catch (error) {
    console.error('Error fetching DeFi summary:', error);
    throw error;
  }
}

/**
 * Clear cache manually (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
  oldestEntry: number | null;
} {
  const entries = Array.from(cache.entries());
  return {
    size: cache.size,
    keys: entries.map(([key]) => key),
    oldestEntry:
      entries.length > 0
        ? Math.min(...entries.map(([, value]) => value.timestamp))
        : null,
  };
}
