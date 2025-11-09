/**
 * Quick Test Script for DeFiLlama API Integration
 * Run this to verify the API is working before testing in the browser
 */

const testEndpoints = async () => {
  console.log('🧪 Testing DeFiLlama API Integration...\n');

  const baseUrl = 'http://localhost:3001';

  // Test 1: Summary endpoint
  console.log('1️⃣  Testing /api/defi/summary...');
  try {
    const summaryRes = await fetch(`${baseUrl}/api/defi/summary`);
    const summaryData = await summaryRes.json();
    
    if (summaryData.success) {
      console.log('✅ Summary API working!');
      console.log('   📊 ETH Price: $' + summaryData.data.ethPrices.eth.toFixed(2));
      console.log('   📊 eETH Price: $' + (summaryData.data.ethPrices.eeth?.toFixed(2) || 'N/A'));
      console.log('   📊 Ether.fi TVL: $' + (summaryData.data.etherfi.tvl / 1e9).toFixed(2) + 'B');
      console.log('   📊 Current APY: ' + (summaryData.data.etherfiYields[0]?.apy.toFixed(2) || 'N/A') + '%');
      console.log('   📊 Top Protocol: ' + summaryData.data.topProtocols[0]?.name);
    } else {
      console.log('❌ Summary API failed:', summaryData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n2️⃣  Testing /api/defi/prices...');
  try {
    const pricesRes = await fetch(`${baseUrl}/api/defi/prices`);
    const pricesData = await pricesRes.json();
    
    if (pricesData.success) {
      console.log('✅ Prices API working!');
      console.log('   💰 ETH: $' + pricesData.data.eth.toFixed(2));
      console.log('   💰 eETH: $' + (pricesData.data.eeth?.toFixed(2) || 'N/A'));
    } else {
      console.log('❌ Prices API failed:', pricesData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n✅ All tests complete! Visit http://localhost:3001/analytics to see the dashboard.');
};

// Run tests
testEndpoints();
