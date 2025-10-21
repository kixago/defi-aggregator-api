# Kixago DeFi Credit Intelligence

**Documentation for the DeFi credit scoring and risk analysis API**

[![Docs](https://img.shields.io/badge/docs-kixago.com-blue)](https://docs.kixago.com)
[![API Status](https://img.shields.io/badge/API-live-success)](https://api.kixago.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

This is the documentation site for Kixago's DeFi Credit Intelligence API. If you need to query lending positions across Aave, Compound, and MakerDAO without spending weeks integrating each protocol separately, you're in the right place.

[Get Started](https://docs.kixago.com/docs/intro) • [API Reference](https://docs.kixago.com/docs/api) • [Get API Key](https://kixago.com/dashboard)

---

## What This Does

Kixago aggregates DeFi lending positions across protocols and chains, then gives you back a credit score (300-850, like FICO) plus detailed risk analysis. One API call, complete picture.

**You get:**
- Credit scores for any wallet address (FICO-style 300-850 range)
- Complete position data across Aave V2/V3, Compound V2/V3, MakerDAO
- Multi-chain aggregation (Ethereum, Base, Arbitrum, Polygon)
- Health factor calculations and liquidation risk analysis
- Actual recommendations you can act on

**Response time:** 1-2 seconds for the whole thing.

---

## Why This Exists

I spent three months last year building DeFi protocol integrations for a client. Aave V2, Aave V3 across four chains, Compound V2, Compound V3, MakerDAO. Each protocol has different ABIs, different data structures, different ways of calculating health factors. By the time I was done, I had 2,000+ lines of code just to answer "what does this wallet owe and what's their risk of liquidation?"

Then the client asked to add another wallet. And another protocol. And support Polygon.

That's when I realized this is a problem everyone building in DeFi has. You either:
- Spend months building and maintaining protocol integrations yourself
- Use indexed data (The Graph, etc.) which is always delayed and fragmented
- Just... don't offer multi-protocol support

None of these are good options. So I built Kixago.

---

## The Actual Problem

Let's say you're building a DeFi dashboard and want to show users their complete lending positions.

### Without Kixago

You need to integrate with each protocol separately:

```typescript
// Aave V3 on Ethereum
const aaveEthProvider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC);
const aaveEthContract = new ethers.Contract(AAVE_V3_ETH_POOL, AaveV3ABI, aaveEthProvider);
const aaveEthData = await aaveEthContract.getUserAccountData(walletAddress);

// Now parse the response, convert to USD, calculate health factor...
// Now do this again for Aave V3 on Base
// And Aave V3 on Arbitrum  
// And Aave V3 on Polygon
// And Aave V2 on Ethereum
// And Compound V2...
// And Compound V3 on Base...
// You get the idea.
```

**Time required:** 2-3 weeks per protocol if you know what you're doing. Longer if you don't.

**Maintenance burden:** Every protocol upgrade means updating your integration.

**Data freshness:** You either query in real-time (slow, expensive) or index it yourself (complex, delayed).

### With Kixago

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/v1/risk-profile/0xWalletAddress"
```

Done. You get everything back in 1-2 seconds, normalized, with risk scores calculated.

**Time required:** 5 minutes to get your first response.

**Maintenance burden:** Zero. We handle protocol upgrades.

**Data freshness:** Real-time. We query the blockchain directly.

---

## Quick Example

Here's what you get back for a real wallet with $2.2B in DeFi positions:

```json
{
  "defi_score": 467,
  "risk_level": "High Risk",
  "total_collateral_usd": 2175957718.47,
  "total_borrowed_usd": 1905081695.88,
  "global_health_factor": 1.067,
  "global_ltv": 89.02,
  
  "risk_factors": [
    {
      "severity": "critical",
      "factor": "Imminent Liquidation Risk",
      "description": "Health factor 1.067 means liquidation occurs if collateral drops 6.7%"
    }
  ],
  
  "recommendations": {
    "immediate": [
      "URGENT: Deposit $387M additional collateral OR repay debt to raise health factor above 1.5"
    ],
    "short_term": [
      "Diversify collateral across multiple assets to reduce concentration risk"
    ],
    "long_term": [
      "Target health factor above 2.0 for safety margin during market volatility"
    ]
  },
  
  "positions": [
    {
      "protocol": "Aave V3",
      "chain": "Ethereum",
      "collateral_usd": 1200000000,
      "borrowed_usd": 1050000000,
      "health_factor": 1.05,
      "assets": { ... }
    }
  ]
}
```

That's a real response. Wallet `0xf0bb20865277aBd641a307eCe5Ee04E79073416C` if you want to verify.

---

## Who Uses This

### If you're a developer

You're building something that needs DeFi position data. Maybe a portfolio tracker, maybe a liquidation bot, maybe a risk dashboard. You don't want to spend months integrating protocols when you could be building features.

```typescript
// Your entire DeFi integration layer
const profile = await kixago.getRiskProfile(walletAddress);

if (profile.defi_score < 550) {
  alertUser("High liquidation risk detected");
}
```

**Use cases:**
- DeFi dashboards and portfolio trackers
- Liquidation monitoring and MEV bots  
- Risk management tools
- Multi-chain wallet analytics
- Lending protocol frontends

### If you're making business decisions

Your company deals with crypto-native customers or DeFi in some capacity. You need to verify positions, assess risk, or underwrite loans. The problem is DeFi positions are invisible to traditional finance.

**Use cases:**
- **Banks/Lenders:** Verify a borrower's $10M DeFi collateral before approving a loan
- **Wealth Advisors:** Monitor client DeFi positions and provide risk management advice
- **Trading Firms:** Identify liquidation opportunities across thousands of wallets
- **Fund Managers:** Track DeFi exposure across portfolio companies

**Example:** A borrower applies for a $1M loan and claims they have $5M in DeFi collateral. You call our API with their wallet address and get back their complete risk profile in 2 seconds. You can verify their collateral, see their health factors, and assess liquidation risk before making a decision.

Traditional finance has had credit bureaus for decades. DeFi didn't. Now it does.

---

## How Credit Scoring Works

We use a 5-factor model that evaluates:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| Health Factor | 40% | How close to liquidation (most critical metric) |
| Leverage Ratio | 30% | Debt-to-collateral ratio (LTV) |
| Diversification | 15% | Concentration risk across assets and protocols |
| Volatility Exposure | 10% | Risk from holding volatile collateral |
| Protocol Risk | 5% | Smart contract maturity and audit history |

The final score maps to a 300-850 range (like FICO):

- **750-850** - Very Low Risk: Healthy positions, plenty of collateral buffer
- **650-749** - Low Risk: Conservative borrowing, monitoring recommended  
- **550-649** - Medium Risk: Moderate leverage, watch closely
- **450-549** - High Risk: Approaching danger zone, reduce leverage soon
- **300-449** - Very High Risk: Imminent liquidation risk, take action immediately

**Why these weights?** Health factor is weighted highest (40%) because it's the single metric that determines liquidation. Below 1.0 means instant liquidation regardless of anything else. LTV is second (30%) because it determines buffer room before hitting that threshold.

[Full scoring methodology in the docs →](https://docs.kixago.com/docs/scoring)

---

## What We Cover

### Protocols
- ✅ Aave V2 (Ethereum, Polygon)
- ✅ Aave V3 (Ethereum, Base, Arbitrum, Polygon)
- ✅ Compound V2 (Ethereum)
- ✅ Compound V3 (Ethereum, Base, Arbitrum, Polygon)
- ✅ MakerDAO (Ethereum)
- In Progress: Morpho, Spark, Euler

### Chains
- ✅ Ethereum (own node infrastructure)
- ✅ Base (own node infrastructure)
- ✅ Arbitrum (Alchemy)
- ✅ Polygon (Alchemy)
- Coming: Optimism, Avalanche, Solana

### Data Points
- ✅ Total collateral (USD-normalized)
- ✅ Total borrowed (USD-normalized)
- ✅ Health factors (per-position and global)
- ✅ LTV ratios
- ✅ Individual asset breakdowns
- ✅ Liquidation price calculations
- ✅ Risk factor analysis with severity levels

---

## API Overview

Base endpoint: `https://api.kixago.com/v1`

### Get Risk Profile
```bash
GET /risk-profile/{address}

# Example
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/v1/risk-profile/vitalik.eth"
```

Returns complete credit analysis including score, positions, risk factors, and recommendations.

### Get Positions Only
```bash
GET /positions/{address}

# Example  
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/v1/positions/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
```

Returns just the position data without scoring (faster if you just need balances).

[Full API reference →](https://docs.kixago.com/docs/api)

---

## SDKs and Code Examples

### Official SDKs

- ✅ **TypeScript/JavaScript SDK** - [kixago-ts](https://github.com/kixago/kixago-ts)
- ✅ **Python SDK** - [kixago-python](https://github.com/kixago/kixago-python)
- Go SDK - Coming soon

**TypeScript Example:**
```typescript
import { Kixago } from '@kixago/sdk';

const kixago = new Kixago('YOUR_API_KEY');
const profile = await kixago.getRiskProfile('vitalik.eth');

console.log(`Credit Score: ${profile.defi_score}`);
console.log(`Risk Level: ${profile.risk_level}`);
```

**Python Example:**
```python
from kixago import Kixago

kixago = Kixago('YOUR_API_KEY')
profile = kixago.get_risk_profile('vitalik.eth')

print(f"Credit Score: {profile.defi_score}")
print(f"Risk Level: {profile.risk_level}")
```

### Community Examples

Check out the [examples directory](https://github.com/kixago/examples) for:
- Next.js dashboard template
- Liquidation monitoring bot
- Telegram alert bot
- Python risk analyzer

If you build something useful, submit a PR and we'll feature it.

---

## Running This Documentation Locally

This is a Docusaurus site. Clone and run:

```bash
git clone https://github.com/kixago/docs.git
cd docs
npm install
npm start
```

Visit `http://localhost:3000`

### Contributing

Found a typo? See outdated info? Want to add an example?

- Report issues: [github.com/kixago/docs/issues](https://github.com/kixago/docs/issues)
- Submit fixes: [github.com/kixago/docs/pulls](https://github.com/kixago/docs/pulls)
- Discuss features: [github.com/kixago/docs/discussions](https://github.com/kixago/docs/discussions)

We review PRs quickly and appreciate any help making the docs better.

---

## Pricing

| Tier | Cost | Requests/Month | Who It's For |
|------|------|----------------|--------------|
| Developer | Free | 10,000 | Testing, side projects, indie devs |
| Startup | $49/mo | 100,000 | Production apps, bots, small teams |
| Institution | $499/mo | 1,000,000 | Banks, advisors, trading firms |
| Enterprise | Custom | Unlimited | High volume, compliance needs, on-premise |

Free tier is actually free. No credit card required, no surprise charges. When you hit the limit, requests fail gracefully with a 429 status code.

[Full pricing details →](https://kixago.com/pricing)

---

## Roadmap

### Currently Available
- ✅ 5 protocols across 4 chains
- ✅ Credit scoring (300-850 range)
- ✅ REST API with OpenAPI spec
- ✅ Real-time data (1-2s response)
- ✅ TypeScript SDK
- ✅ Python SDK
- ✅ Complete documentation

### Next 1-3 Months
- Additional protocols (Morpho, Spark, Euler, Radiant)
- Historical score tracking and trend analysis
- Webhook alerts for health factor changes
- Yield optimization suggestions
- Additional chains (Optimism, Avalanche)
- GraphQL API endpoint
- Go SDK

### Enterprise Features (Actively Building)
- PDF credit reports with custom branding
- Multi-wallet portfolio tracking
- Custom scoring model weights for institutional risk appetites
- On-premise deployment option
- SSO and role-based access control
- White-label API solutions
- Dedicated support and SLA guarantees

We ship continuously. Follow [@kixago](https://twitter.com/kixago) for real-time updates.

---

## Technical Details

### How We Get The Data

We run our own nodes. All queries go directly to the blockchain in real-time - we're not using indexed data that's hours or days old.

When you request a risk profile:
1. We query all protocols on all chains in parallel
2. Decode the responses using protocol-specific ABIs
3. Normalize everything to USD using Chainlink + CoinDesk price feeds
4. Calculate health factors and risk scores
5. Generate recommendations based on the analysis
6. Cache the result for 30 seconds

Total time: 1-2 seconds on average.

### Rate Limits

Free tier: 10,000 requests/month, max 10 requests/second  
Paid tiers: [See pricing page](https://kixago.com/pricing)

If you hit the rate limit, you get a `429 Too Many Requests` with a `Retry-After` header.

### Error Handling

We return standard HTTP status codes with helpful error messages:

```json
{
  "error": "INVALID_ADDRESS",
  "message": "Address must be a valid Ethereum address or ENS name",
  "status": 400
}
```

Common errors are documented in the API reference.

---

## Support and Community

- **Documentation:** [docs.kixago.com](https://docs.kixago.com)
- **API Status:** [status.kixago.com](https://status.kixago.com)  
- **Email:** hello@kixago.com
- **Twitter:** [@kixago](https://twitter.com/kixago)
- **GitHub Issues:** [github.com/kixago/docs/issues](https://github.com/kixago/defi-aggregator-api/issues)

For API issues or bugs, GitHub issues are fastest. For business inquiries, use email.

---

## License

This documentation is MIT licensed. The Kixago API itself is proprietary - see [Terms of Service](https://kixago.com/terms).

---

## Acknowledgments

Built with [Docusaurus](https://docusaurus.io).

Thanks to the teams building the protocols that make DeFi possible:
- [Aave](https://aave.com) - Leading DeFi lending protocol
- [Compound](https://compound.finance) - Pioneer of algorithmic money markets
- [MakerDAO](https://makerdao.com) - Decentralized stablecoin infrastructure

We're protocol-agnostic infrastructure, but we appreciate the work these teams have done to create open, transparent, and auditable financial systems.

---

**Built by developers who got tired of rebuilding the same DeFi integrations over and over.**

[Get Started](https://docs.kixago.com/docs/intro) • [Get API Key](https://kixago.com) • [View API Reference](https://docs.kixago.com/docs/api)
