---
sidebar_position: 1
---

# Quick Start

Get up and running with Kixago in under 5 minutes.

## Prerequisites

You need:
- A wallet address to query (any Ethereum address works, even your own)
- Basic knowledge of REST APIs
- Optional: Node.js, Python, or Go for code examples

That's it. No API keys required for now.

## Step 1: Get Your API Key

Visit the [Kixago Dashboard](https://kixago.com/dashboard) and sign up to get your API key.

Your key will look like this:
```
kixakey_7eBHF9Ndxd_7eBHF9Ndxdq-I3q4Ds4nULLPQd-vElx9KC8fa6NDZiw
```

⚠️ **Save it immediately** - API keys are only shown once when created.

## Step 2: Test the API

Let's verify the API is working with your new key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/health"
```

You should see:

```json
{
  "status": "ok",
  "timestamp": "2025-10-15T14:30:00Z"
}
```

✅ **Success!** The API is live and your key works.

## Step 3: Query a Real Address

Let's query a real address with known positions:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
```

**What happens:**
1. Kixago queries Aave V2/V3, Compound V2/V3, and MakerDAO
2. Searches across Ethereum, Polygon, Arbitrum, and Base
3. Returns only active positions (positions with collateral or debt)
4. Results are cached for 60 seconds

**First query:** Takes 2-5 seconds (hitting blockchain RPCs)  
**Cached queries:** Returns in ~50ms

## Step 4: Understand Authentication

Kixago supports two authentication methods:

### Method 1: Authorization Header (Recommended)

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0x..."
```

**Why recommended:**
- More secure (not logged in URLs)
- Standard REST practice
- Works with all HTTP clients

### Method 2: Query Parameter (Alternate)

```bash
curl "https://api.kixago.com/api/v1/lending/positions?address=0x...&api-key=YOUR_API_KEY"
```

**Use when:**
- Testing in browser
- Quick debugging
- Webhook URLs that need embedded auth

⚠️ **Note**: Query parameter method may expose keys in logs. Use header method in production.

## Step 5: Understand the Response

Here's a real response structure:

```json
{
  "success": true,
  "data": {
    "positions": [
      {
        "protocol": "aave",
        "protocol_version": "v3",
        "chain": "ethereum",
        "user_address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "collateral_details": [
          {
            "token": "WETH",
            "amount": 100.0,
            "usd_value": 300000.00,
            "apy": 2.1,
            "token_address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          }
        ],
        "borrowed_details": [
          {
            "token": "USDC",
            "amount": 50000.00,
            "usd_value": 50000.00,
            "apy": 6.2,
            "token_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
          }
        ],
        "collateral_usd": 300000.00,
        "borrowed_usd": 50000.00,
        "ltv_current": 0.167,
        "ltv_liquidation_threshold": 0.825,
        "health_factor": 4.95,
        "is_at_risk": false,
        "time_to_liquidation": "No immediate risk",
        "last_updated": "2025-10-15T14:30:00Z"
      }
    ],
    "count": 1,
    "errors": {},
    "duration": "3.2s",
    "cache_info": {
      "successes": 1,
      "errors": 0
    }
  },
  "timestamp": "2025-10-15T14:30:00Z"
}
```

### Key Fields Explained

| Field | What It Means | Example |
|-------|--------------|---------|
| `protocol` | Which DeFi protocol | "aave", "compound", "makerdao" |
| `chain` | Which blockchain | "ethereum", "polygon", "base" |
| `collateral_details[]` | Assets deposited as collateral | Array of tokens |
| `borrowed_details[]` | Assets borrowed against collateral | Array of tokens |
| `health_factor` | Liquidation risk (>1.0 is safe) | 4.95 = very safe |
| `ltv_current` | Loan-to-value ratio | 0.167 = 16.7% borrowed vs collateral |
| `is_at_risk` | Quick check for danger | false = safe |

## Step 6: Filter by Chain

Only want Ethereum positions? Add the `chains` parameter:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress&chains=ethereum"
```

Multiple chains:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress&chains=ethereum,polygon"
```

**Available chains:**
- `ethereum` - Ethereum mainnet
- `polygon` - Polygon (Matic)
- `arbitrum` - Arbitrum One
- `base` - Base (Coinbase L2)

## Step 7: Check Portfolio Risk

Want to know if positions are at liquidation risk? Use the risk endpoint:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/risk/portfolio?address=0xYourAddress"
```

Response includes:

```json
{
  "success": true,
  "data": {
    "total_collateral_usd": 300000.00,
    "total_borrowed_usd": 50000.00,
    "weighted_health_factor": 4.95,
    "liquidation_risk_score": 0.1,
    "positions_at_risk": 0,
    "positions_near_risk": 0,
    "recommended_actions": []
  }
}
```

**Risk Score Guide:**
- `0.0 - 0.2` = Low risk (safe)
- `0.3 - 0.5` = Medium risk (monitor)
- `0.6 - 0.8` = High risk (take action)
- `0.9 - 1.0` = Critical risk (liquidation imminent)

## Code Examples

### JavaScript/TypeScript

```typescript
// Store your API key securely
const KIXAGO_API_KEY = process.env.KIXAGO_API_KEY;

// Using fetch (Node 18+ or browser)
async function getPositions(address: string) {
  const response = await fetch(
    `https://api.kixago.com/api/v1/lending/positions?address=${address}`,
    {
      headers: {
        'Authorization': `Bearer ${KIXAGO_API_KEY}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data.positions;
}

// Usage
const positions = await getPositions('0xYourAddress');

positions.forEach(pos => {
  console.log(`${pos.protocol} on ${pos.chain}:`);
  console.log(`  Collateral: ${pos.collateral_usd.toFixed(2)}`);
  console.log(`  Borrowed: ${pos.borrowed_usd.toFixed(2)}`);
  console.log(`  Health Factor: ${pos.health_factor.toFixed(2)}`);
});
```

### Python

```python
import os
import requests

# Store your API key securely
KIXAGO_API_KEY = os.getenv('KIXAGO_API_KEY')

def get_positions(address: str):
    url = "https://api.kixago.com/api/v1/lending/positions"
    headers = {
        'Authorization': f'Bearer {KIXAGO_API_KEY}'
    }
    params = {"address": address}
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    
    data = response.json()
    return data["data"]["positions"]

# Usage
positions = get_positions("0xYourAddress")

for pos in positions:
    print(f"{pos['protocol']} on {pos['chain']}:")
    print(f"  Collateral: ${pos['collateral_usd']:.2f}")
    print(f"  Borrowed: ${pos['borrowed_usd']:.2f}")
    print(f"  Health Factor: {pos['health_factor']:.2f}")
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"
)

type Position struct {
    Protocol      string  `json:"protocol"`
    Chain         string  `json:"chain"`
    CollateralUSD float64 `json:"collateral_usd"`
    BorrowedUSD   float64 `json:"borrowed_usd"`
    HealthFactor  float64 `json:"health_factor"`
}

type Response struct {
    Success bool `json:"success"`
    Data    struct {
        Positions []Position `json:"positions"`
    } `json:"data"`
}

func getPositions(address string) ([]Position, error) {
    apiKey := os.Getenv("KIXAGO_API_KEY")
    
    url := fmt.Sprintf(
        "https://api.kixago.com/api/v1/lending/positions?address=%s",
        address,
    )
    
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("Authorization", "Bearer "+apiKey)
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result Response
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }
    
    return result.Data.Positions, nil
}

func main() {
    positions, err := getPositions("0xYourAddress")
    if err != nil {
        panic(err)
    }
    
    for _, pos := range positions {
        fmt.Printf("%s on %s:\n", pos.Protocol, pos.Chain)
        fmt.Printf("  Collateral: $%.2f\n", pos.CollateralUSD)
        fmt.Printf("  Borrowed: $%.2f\n", pos.BorrowedUSD)
        fmt.Printf("  Health Factor: %.2f\n", pos.HealthFactor)
    }
}
```

### cURL with Pretty Print

```bash
curl -s -H "Authorization: Bearer $KIXAGO_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress" \
  | jq '.data.positions[] | {protocol, chain, collateral_usd, borrowed_usd, health_factor}'
```

## Common Issues

### "Unauthorized" Error

**Problem:** You forgot to include your API key or it's malformed.

**Error Response:**
```json
{
  "success": false,
  "error": "Unauthorized. Authorization: Bearer <key> header or ?api-key=<key> parameter required.",
  "timestamp": "2025-10-15T22:35:41Z"
}
```

**Solution:**
```bash
# Wrong ❌ - No API key
curl "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"

# Right ✅ - With Authorization header
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"

# Also Right ✅ - With query parameter
curl "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress&api-key=YOUR_API_KEY"
```

### "address parameter required"

**Problem:** You forgot the `address` query parameter.

**Solution:**
```bash
# Wrong ❌
curl "https://api.kixago.com/api/v1/lending/positions"

# Right ✅
curl "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"
```

### "invalid address format"

**Problem:** Address is not a valid Ethereum address.

**Solution:** Address must:
- Start with `0x`
- Be exactly 42 characters long (0x + 40 hex characters)
- Example: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`

### Empty `positions` Array

**Problem:** The address has no active lending positions.

**Solution:** This is normal! Not every address has DeFi positions. Try:
1. An address you know has positions
2. Check a DeFi protocol directly to verify
3. Use a well-known DeFi user's address for testing

### Slow First Query

**Problem:** First API call takes 3-5 seconds.

**Solution:** This is expected! Kixago queries blockchain RPCs directly. Subsequent queries are cached and return in ~50ms. For production:
- Cache results on your side
- Use webhooks (coming soon) for real-time updates
- Query less frequently (positions don't change every second)

## Next Steps

You're now ready to build! Choose your path:

- **[Authentication →](./auth)** - API keys and rate limits (coming soon)
- **[Full API Reference →](../api/overview)** - Complete endpoint documentation
- **[Code Examples →](../examples/javascript)** - More complete examples
- **[Self-Hosting →](../self-hosting/docker)** - Run Kixago on your own infrastructure

## Pro Tips

1. **Cache aggressively** - Positions don't change every second. Cache for 30-60 seconds on your side.

2. **Handle partial failures** - Check the `errors` object in responses. One protocol failing shouldn't break your app.

3. **Monitor health factors** - Health factor < 1.5 deserves user attention. < 1.2 deserves urgent alerts.

4. **Use TypeScript** - We provide TypeScript types (coming soon) for better DX.

5. **Start with one chain** - Use `?chains=ethereum` while testing to reduce response time.

---

**Questions?** [Open an issue on GitHub](https://github.com/kixago/defi-aggregator-api/issues) or email support@kixago.com.
