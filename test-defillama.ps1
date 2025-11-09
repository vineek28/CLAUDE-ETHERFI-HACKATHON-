# Test DeFiLlama API directly
Write-Host "`n=== Testing DeFiLlama API ===" -ForegroundColor Green

Write-Host "`n1. Fetching Ether.fi protocol data..." -ForegroundColor Cyan
$etherfi = Invoke-RestMethod -Uri "https://api.llama.fi/protocol/ether.fi"
Write-Host "   TVL: $" -NoNewline
Write-Host $etherfi.tvl[0].totalLiquidityUSD -ForegroundColor Yellow
Write-Host "   Symbol: $($etherfi.symbol)"
Write-Host "   Category: $($etherfi.category)"

Write-Host "`n2. Fetching ETH price..." -ForegroundColor Cyan
$prices = Invoke-RestMethod -Uri "https://coins.llama.fi/prices/current/ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
$ethPrice = $prices.coins."ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".price
Write-Host "   ETH Price: $" -NoNewline
Write-Host $ethPrice -ForegroundColor Yellow

Write-Host "`n3. Fetching top DeFi protocols..." -ForegroundColor Cyan
$protocols = Invoke-RestMethod -Uri "https://api.llama.fi/protocols"
Write-Host "   Total protocols: $($protocols.Count)"
Write-Host "   Top 5:" -ForegroundColor Yellow
$protocols | Select-Object -First 5 | ForEach-Object {
    Write-Host "   - $($_.name): $" -NoNewline
    Write-Host ([math]::Round($_.tvl / 1000000000, 2)) -NoNewline -ForegroundColor Yellow
    Write-Host "B"
}

Write-Host "`n=== ALL DATA IS REAL AND LIVE ===" -ForegroundColor Green
Write-Host "Compare with https://defillama.com/protocol/ether.fi" -ForegroundColor Cyan
