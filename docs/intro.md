sidebar_position: 1
slug: /
---

# Welcome to Kixago

**Query all your DeFi lending positions with one API call.**

Kixago is a DeFi data aggregator that solves the multi-protocol, multi-chain integration problem. Instead of building separate integrations for Aave on Ethereum, Aave on Polygon, Compound V2, Compound V3, and MakerDAO—you call our API once and get everything back in a normalized format.

## The Problem We Solve

Let's say you want to build a simple dashboard showing a user's lending positions. Here's what you'd normally do:

```typescript
// Without Kixago (the hard way) ❌
const aaveEthereumData = await aaveAPI.getUserData(address, 'ethereum');
const aavePolygonData = await aaveAPI.getUserData(address, 'polygon');
const aaveArbitrumData = await aaveAPI.getUserData(address, 'arbitrum');
const compoundData = await compoundAPI.getAccountLiquidity(address);
const makerData = await makerVault.getVault(address);

// Now manually normalize 5 different response formats... 😫
// Handle different decimal formats...
// Convert health factors that mean different things...
// Map collateral types...
// Spend 2 weeks debugging edge cases...
```

With Kixago, it's just:

```typescript
// With Kixago (the easy way) ✅
const response = await fetch(
  `https://api.kixago.com/api/v1/lending/positions?address=${address}`
);
const { positions } = await response.json();

// Done. All protocols. All chains. One format. 🎉
```

## What Makes Kixago Different

| Feature | Kixago | Other APIs |
|---------|--------|-----------|
| **Multi-Protocol** | Aave, Compound, MakerDAO in one call | One protocol at a time |
| **Multi-Chain** | Ethereum, Polygon, Arbitrum, Base | Single chain or manual iteration |
| **Normalized Format** | Same structure for all protocols | Different response for each |
| **Real-Time** | Direct blockchain queries | Often delayed by indexers |
| **Open Source** | MIT licensed, audit the code | Proprietary black boxes |

## Quick Start (60 seconds)

### 1. Get Your API Key

Visit [kixago.com/dashboard](https://kixago.com/dashboard) and sign up. You'll get an API key that looks like:

```
kixakey_7eBHF9Ndxd_7eBHF9Ndxdq-I3q4Ds4nULLPQd-vElx9KC8fa6NDZiw
```

⚠️ Save it immediately - keys are only shown once!

### 2. Make Your First API Call

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddressHere"
```

### 2. Get a Sample Response

Here's what you'll get back (example with an Aave position):

```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "protocol": "aave",
        "protocol_version": "v3",
        "chain": "base",
        "user_address": "0xf0bb20865277abd641a307ece5ee04e79073416c",
        "collateral_details": [
          {
            "token": "WETH",
            "amount": 1.5,
            "usd_value": 4500.00,
            "apy": 2.3,
            "token_address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        ],
        "borrowed_details": [
          {
            "token": "USDC",
            "amount": 2000.00,
            "usd_value": 2000.00,
            "apy": 5.8,
            "token_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
          }
        ],
        "collateral_usd": 4500.00,
        "borrowed_usd": 2000.00,
        "ltv_current": 0.44,
        "ltv_liquidation_threshold": 0.80,
        "health_factor": 1.8,
        "is_at_risk": false,
        "time_to_liquidation": "No immediate risk",
        "last_updated": "2025-10-15T14:30:00Z"
      }
    ],
    "count": 1,
    "duration": "2.3s"
  },
  "timestamp": "2025-10-15T14:30:00Z"
}
```

### 3. Understand the Key Fields

Every position includes:

- **`collateral_details`** - What tokens the user deposited (with APY and USD value)
- **`borrowed_details`** - What tokens the user borrowed (with APY and USD value)
- **`health_factor`** - Risk metric (< 1.0 = liquidation risk, > 2.0 = safe)
- **`ltv_current`** - Current loan-to-value ratio
- **`is_at_risk`** - Boolean flag for immediate liquidation danger

That's it. You're now querying DeFi positions across 5 protocols and 4 chains.

## Common Use Cases

### 🎯 Portfolio Dashboard

Show users all their lending positions in one view:

```javascript
const positions = await fetchKixagoPositions(userAddress);

// Group by protocol
const byProtocol = positions.reduce((acc, pos) => {
  acc[pos.protocol] = acc[pos.protocol] || [];
  acc[pos.protocol].push(pos);
  return acc;
}, {});

// Calculate total TVL
const totalCollateral = positions.reduce((sum, pos) => 
  sum + pos.collateral_usd, 0
);
```

### 🚨 Liquidation Alerts

Monitor positions and send alerts when health factor drops:

```javascript
const checkLiquidationRisk = async (address) => {
  const { positions } = await fetchKixagoPositions(address);
  
  const atRisk = positions.filter(p => p.health_factor < 1.5);
  
  if (atRisk.length > 0) {
    await sendAlert({
      message: `⚠️ ${atRisk.length} positions at risk!`,
      positions: atRisk
    });
  }
};

// Run every 5 minutes
setInterval(() => checkLiquidationRisk(userAddress), 5 * 60 * 1000);
```

### 📊 Yield Comparison

Compare your APY across protocols:

```javascript
const positions = await fetchKixagoPositions(userAddress);

// Find your USDC positions
const usdcPositions = positions.flatMap(p => 
  p.collateral_details.filter(c => c.token === 'USDC')
);

// Sort by APY
usdcPositions.sort((a, b) => b.apy - a.apy);

console.log(`Best USDC APY: ${usdcPositions[0].apy}% on ${positions[0].protocol}`);
```

## Protocol Coverage

Here's what Kixago currently supports:

| Protocol | Versions | Chains | Status |
|----------|----------|--------|--------|
| **Aave** | V2, V3 | Ethereum, Polygon, Arbitrum, Base | ✅ Live |
| **Compound** | V2, V3 | Ethereum, Arbitrum, Base, Polygon | ✅ Live |
| **MakerDAO** | CDP/Vaults | Ethereum | ✅ Live |

More protocols coming soon: Morpho, Spark, Venus, Radiant.

## Response Time & Caching

**First Query (no cache):**
- 2-5 seconds (queries all protocols on all chains)

**Subsequent Queries (cached):**
- ~50ms (served from Redis cache)
- Cache TTL: 60 seconds

**Tips for Production:**
- Results are cached for 60 seconds automatically
- Query once, cache on your side if you need faster responses
- Use webhooks (coming soon) for real-time updates

## Error Handling

Kixago handles partial failures gracefully:

```json
{
  "success": true,
  "data": {
    "positions": [...],
    "count": 2,
    "errors": {
      "compound-v3:polygon": "RPC timeout"
    }
  }
}
```

Even if one protocol/chain fails, you still get data from the others. The `errors` object tells you what went wrong.

## Rate Limits

Currently **no rate limits** during beta. We'll add fair usage limits before public launch:

- **Free Tier**: 100 requests/minute (planned)
- **Pro Tier**: 1000 requests/minute (planned)

## What's Next?

Pick your path:

1. **[Quick Start Guide →](./quickstart/setup)** - Set up your development environment
2. **[API Reference →](./api/overview)** - Full endpoint documentation
3. **[Code Examples →](./examples/javascript)** - Copy-paste working code
4. **[GitHub Repo →](https://github.com/kixago/defi-aggregator-api)** - Star us, contribute, or self-host

## Need Help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/kixago/defi-aggregator-api/issues)
- **Email**: support@kixago.com
- **Discord**: [Join our community](https://discord.gg/kixago) (coming soon)

---

## Philosophy

Kixago is built on three principles:

1. **Developers should focus on building, not integrating** - We handle the complexity of multi-protocol queries
2. **Open source builds trust** - Audit our code, run it yourself, contribute improvements
3. **Simple APIs win** - One endpoint, one format, zero surprises

Now let's get you building. [Continue to Quick Start →](./quickstart/setup)
