# Kixago DeFi Aggregator API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://go.dev/)
[![API Status](https://img.shields.io/badge/API-Live-success)](https://api.kixago.com/api/v1/health)
[![Documentation](https://img.shields.io/badge/docs-live-brightgreen)](https://docs.kixago.com)

**Query all your DeFi lending positions with one API call.**

Kixago aggregates lending data from Aave, Compound, and MakerDAO across Ethereum, Polygon, Arbitrum, and Base—returning everything in a single, normalized JSON response.

```bash
# Instead of querying 5+ APIs separately...
curl "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"

# Get all positions across all protocols and chains in one response
```

---

## 🎯 Why Kixago?

### The Problem

Building DeFi apps means integrating with multiple protocols across multiple chains. Each has:
- Different smart contract interfaces
- Different data formats
- Different response structures
- Different RPC requirements
- Different error handling

**A simple "show me my lending positions" feature requires weeks of integration work.**

### The Solution

Kixago does the hard work for you:

| What You Want | Without Kixago | With Kixago |
|---------------|----------------|-------------|
| Query Aave + Compound + MakerDAO | 3 separate APIs, 3 data formats | 1 API call, 1 format |
| Support Ethereum + Polygon + Arbitrum + Base | Maintain 4+ RPC integrations | Built-in multi-chain |
| Normalize health factors, LTV, APY | Write custom logic per protocol | Already normalized |
| Cache results | Build your own Redis layer | Included (60s TTL) |
| Handle errors gracefully | Custom retry logic per protocol | Automatic fallbacks |

**Time saved: 2-3 weeks of development work.**

---

## ⚡ Quick Start

### Get Your API Key

1. Visit [kixago.com/dashboard](https://kixago.com/dashboard)
2. Sign up (takes 30 seconds)
3. Generate your API key
4. Save it securely (shown only once!)

### Try It Now

```bash
# Health check
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.kixago.com/api/v1/health

# Get lending positions
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

# Get portfolio risk analysis
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.kixago.com/api/v1/risk/portfolio?address=0xYourAddress"
```

### Code Example (JavaScript)

```javascript
const KIXAGO_API_KEY = process.env.KIXAGO_API_KEY;

const response = await fetch(
  'https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress',
  {
    headers: {
      'Authorization': `Bearer ${KIXAGO_API_KEY}`
    }
  }
);
const { data } = await response.json();

data.positions.forEach(position => {
  console.log(`${position.protocol} on ${position.chain}:`);
  console.log(`  Collateral: ${position.collateral_usd}`);
  console.log(`  Borrowed: ${position.borrowed_usd}`);
  console.log(`  Health Factor: ${position.health_factor}`);
});
```

**[Full Documentation →](https://docs.kixago.com)**

---

## 🌟 Features

### Multi-Protocol Support

- **Aave V2** - Ethereum, Polygon
- **Aave V3** - Ethereum, Polygon, Arbitrum, Base
- **Compound V2** - Ethereum
- **Compound V3** - Ethereum, Arbitrum, Base, Polygon
- **MakerDAO** - Ethereum (CDP/Vaults)

**More protocols coming:** Morpho, Spark, Venus, Radiant

### Multi-Chain by Default

Query all chains simultaneously or filter by specific chains:

```bash
# All chains (default)
curl "https://api.kixago.com/api/v1/lending/positions?address=0x..."

# Specific chains only
curl "https://api.kixago.com/api/v1/lending/positions?address=0x...&chains=ethereum,polygon"
```

### Normalized Data Format

All protocols return the same structure:

```json
{
  "protocol": "aave",
  "chain": "ethereum",
  "collateral_usd": 10000.00,
  "borrowed_usd": 5000.00,
  "health_factor": 2.0,
  "ltv_current": 0.50,
  "is_at_risk": false,
  "collateral_details": [...],
  "borrowed_details": [...]
}
```

### Built-In Caching

- Redis/Valkey caching layer (60-second TTL)
- First query: 2-5 seconds (live blockchain data)
- Cached queries: ~50ms response time
- Optional PostgreSQL for persistent caching

### Real-Time Data

Direct blockchain RPC queries, no indexer delays:
- Own node infrastructure for major chains
- Automatic fallback to secondary RPCs
- Real-time pricing via Chainlink + CoinGecko

---

## 📚 API Endpoints

### `GET /lending/positions`

Get all lending positions for an address across all protocols and chains.

**Parameters:**
- `address` (required) - Ethereum address to query
- `chains` (optional) - Comma-separated chain list (e.g., `ethereum,polygon`)

**[Full API Reference →](https://docs.kixago.com/api)**

### `GET /risk/portfolio`

Analyze liquidation risk across all positions.

**Response includes:**
- Total collateral and debt
- Weighted health factor
- Liquidation risk score (0-1)
- Recommended actions

### `GET /health`

Health check endpoint for monitoring.

---

## 🛠️ Self-Hosting

Want to run Kixago yourself? It's open source (MIT licensed).

### Quick Start with Docker

```bash
git clone https://github.com/kixago/defi-aggregator-api
cd defi-aggregator-api

# Copy and configure environment
cp .env.example .env
# Edit .env with your RPC URLs

# Start with Docker Compose
docker-compose up -d
```

### Requirements

- **Go 1.21+** for the API server
- **Redis/Valkey** for caching
- **PostgreSQL** (optional) for persistent data
- **RPC endpoints** for each chain (Alchemy, Infura, or your own nodes)

### Environment Variables

```bash
# Required: RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# Optional: Caching
VALKEY_URL=redis://localhost:6379
DEFI_DATABASE_URL=postgresql://user:pass@localhost/defi

# Optional: Pricing
COINGECKO_API_KEY=your_coingecko_key
```

**[Self-Hosting Guide →](https://docs.kixago.com/self-hosting/docker)**

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Client App    │
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────────────────────────────┐
│         Kixago API Server (Go)          │
│  ┌────────────────────────────────────┐ │
│  │  Aggregator (Concurrent Queries)   │ │
│  └────┬──────┬──────┬──────┬──────┬───┘ │
│       │      │      │      │      │     │
│   ┌───▼──┐ ┌─▼───┐ ┌▼───┐ ┌▼──┐ ┌▼───┐ │
│   │ Aave │ │Comp.│ │Mak.│ │...│ │... │ │
│   │  V2  │ │ V2  │ │DAO │ │   │ │    │ │
│   └──────┘ └─────┘ └────┘ └───┘ └────┘ │
└──────────┬──────────────────┬───────────┘
           │                  │
    ┌──────▼──────┐    ┌─────▼──────┐
    │   Valkey    │    │  Blockchain │
    │   (Cache)   │    │  RPC Nodes  │
    └─────────────┘    └────────────┘
```

**Key Components:**

- **Aggregator** - Orchestrates concurrent protocol queries
- **Decoders** - Protocol-specific smart contract decoders (Aave, Compound, MakerDAO)
- **Pricing Service** - Multi-source price feeds (Chainlink, CoinGecko)
- **Cache Layer** - Redis/Valkey for performance
- **RPC Client** - Manages blockchain connections with automatic fallbacks

---

## 📖 Documentation

### For Users

- **[Getting Started](https://docs.kixago.com)** - Quick start guide
- **[API Reference](https://docs.kixago.com/api)** - Complete endpoint docs
- **[Code Examples](https://docs.kixago.com/examples)** - Production-ready code

### For Contributors

- **[Architecture Guide](./docs/architecture.md)** - System design and patterns
- **[Adding Protocols](./docs/adding-protocols.md)** - How to add new protocols
- **[Development Setup](./docs/development.md)** - Local development guide

---

## 🎯 Use Cases

### 1. Portfolio Dashboards

Show users all their DeFi positions in one view:

```javascript
// Fetch positions
const positions = await fetchPositions(userAddress);

// Calculate totals
const totalCollateral = positions.reduce((sum, p) => sum + p.collateral_usd, 0);
const totalBorrowed = positions.reduce((sum, p) => sum + p.borrowed_usd, 0);
```

### 2. Liquidation Alert Bots

Monitor health factors and alert users:

```javascript
const atRisk = positions.filter(p => p.health_factor < 1.5);
if (atRisk.length > 0) {
  await sendAlert(`⚠️ ${atRisk.length} positions at risk!`);
}
```

### 3. Yield Aggregators

Compare APYs across protocols:

```javascript
const opportunities = positions
  .flatMap(p => p.collateral_details)
  .sort((a, b) => b.apy - a.apy);
```

### 4. Risk Management Tools

Calculate portfolio-wide risk:

```bash
curl "https://api.kixago.com/api/v1/risk/portfolio?address=0x..."
```

**[More Examples →](https://docs.kixago.com/examples)**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Protocols

1. Fork the repository
2. Create a new decoder in `internal/decoders/[protocol]/`
3. Implement the `ProtocolDecoder` interface
4. Add configuration in `internal/config/config.go`
5. Submit a pull request

**[Protocol Integration Guide →](./docs/adding-protocols.md)**

### Reporting Bugs

Found a bug? [Open an issue](https://github.com/kixago/defi-aggregator-api/issues/new/choose) with:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Go version, OS, etc.)

### Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add more code examples
- Improve API descriptions
- Translate to other languages

---

## 🗺️ Roadmap

### Current (v1.0 - MVP)

- ✅ Aave V2/V3 support
- ✅ Compound V2/V3 support
- ✅ MakerDAO support
- ✅ Multi-chain (Ethereum, Polygon, Arbitrum, Base)
- ✅ Caching layer (Valkey/Redis)
- ✅ Pricing service (Chainlink + CoinGecko)
- ✅ Complete API documentation

### Next (v1.1 - Q1 2026)

- [ ] Morpho protocol support
- [ ] Spark protocol support
- [ ] Historical position tracking
- [ ] Webhooks for position updates
- [ ] GraphQL API
- [ ] Optimism and Avalanche support

### Future (v2.0+)

- [ ] Liquidity pool aggregation (Uniswap, Curve, Balancer)
- [ ] Staking protocol support
- [ ] Yield farming aggregation
- [ ] On-chain transaction building
- [ ] Mobile SDKs (iOS, Android)

**[Full Roadmap →](https://github.com/kixago/defi-aggregator-api/projects/1)**

---

## 📊 Performance

### Benchmarks

Tested on: 8-core CPU, 16GB RAM, local Valkey

| Scenario | Response Time | Notes |
|----------|--------------|-------|
| Single protocol, cached | ~50ms | Served from cache |
| Single protocol, uncached | 1-3s | Live blockchain query |
| All protocols, all chains (cached) | ~80ms | Parallel cache lookups |
| All protocols, all chains (uncached) | 3-5s | Concurrent RPC calls |

### Caching Strategy

- **Position data**: 60-second TTL
- **Price data**: 30-second TTL
- **Token metadata**: 1-hour TTL
- **Protocol addresses**: Permanent (config-driven)

---

## 🔒 Security

### API Security

- No authentication required during beta
- Rate limiting (fair use policy)
- Input validation on all endpoints
- RPC key rotation support

### Self-Hosting Security

- Environment variables for secrets
- No hardcoded credentials
- Redis password protection supported
- HTTPS recommended for production

**Report security issues to: security@kixago.com**

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

### What This Means

- ✅ Use commercially (even in production)
- ✅ Modify the code however you want
- ✅ Distribute your modified versions
- ✅ Use privately
- ⚠️ Include the original license and copyright notice

**No warranty provided. Use at your own risk.**

---

## 🙏 Acknowledgments

Built with:
- [Go](https://go.dev/) - Fast, compiled backend
- [Gin](https://gin-gonic.com/) - HTTP framework
- [go-ethereum](https://geth.ethereum.org/) - Ethereum client library
- [Valkey](https://valkey.io/) - Redis-compatible cache
- [Docusaurus](https://docusaurus.io/) - Documentation site

Inspired by the complexity of DeFi integration and the need for better developer tools.

---

## 📞 Support

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/kixago/defi-aggregator-api/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/kixago/defi-aggregator-api/discussions)
- **Discord**: [Join our community](https://discord.gg/kixago) (coming soon)

### Commercial

- **Email**: support@kixago.com
- **Documentation**: https://docs.kixago.com
- **API Status**: https://status.kixago.com (coming soon)

---

## ⭐ Star Us!

If Kixago saves you time, please star this repository. It helps others discover the project!

[![GitHub stars](https://img.shields.io/github/stars/kixago/defi-aggregator-api?style=social)](https://github.com/kixago/defi-aggregator-api/stargazers)

---

<div align="center">

**Built with ❤️ for DeFi developers**

[Documentation](https://docs.kixago.com) • [API Reference](https://docs.kixago.com/api) • [Examples](https://docs.kixago.com/examples) • [GitHub](https://github.com/kixago/defi-aggregator-api)

</div>
