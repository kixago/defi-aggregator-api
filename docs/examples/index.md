---
sidebar_position: 3
---

# Code Examples

Real-world examples you can copy and paste into your projects.

## Complete Working Examples

### 1. Liquidation Alert Bot (JavaScript)

Monitor positions and send alerts when health factor drops below a threshold.

```javascript
// liquidation-monitor.js
const ALERT_THRESHOLD = 1.5; // Alert when HF < 1.5
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

class LiquidationMonitor {
  constructor(addresses) {
    this.addresses = addresses;
    this.lastAlerts = new Map(); // Prevent alert spam
  }

  async checkPositions() {
    for (const address of this.addresses) {
      try {
        const positions = await this.fetchPositions(address);
        const atRisk = positions.filter(
          p => p.health_factor < ALERT_THRESHOLD
        );

        if (atRisk.length > 0) {
          await this.sendAlert(address, atRisk);
        }
      } catch (error) {
        console.error(`Error checking ${address}:`, error);
      }
    }
  }

  async fetchPositions(address) {
    const response = await fetch(
      `https://api.kixago.com/api/v1/lending/positions?address=${address}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.positions;
  }

  async sendAlert(address, positions) {
    // Prevent duplicate alerts within 1 hour
    const lastAlert = this.lastAlerts.get(address);
    if (lastAlert && Date.now() - lastAlert < 60 * 60 * 1000) {
      return;
    }

    console.log(`🚨 ALERT for ${address}:`);
    positions.forEach(p => {
      console.log(
        `  ${p.protocol} on ${p.chain}: HF ${p.health_factor.toFixed(2)}`
      );
      console.log(`    Collateral: $${p.collateral_usd.toFixed(2)}`);
      console.log(`    Borrowed: $${p.borrowed_usd.toFixed(2)}`);
    });

    // Send to Slack, Discord, Email, etc.
    await this.sendToSlack(address, positions);

    this.lastAlerts.set(address, Date.now());
  }

  async sendToSlack(address, positions) {
    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (!webhook) return;

    const text = positions.map(p =>
      `*${p.protocol}* on ${p.chain}\n` +
      `Health Factor: ${p.health_factor.toFixed(2)}\n` +
      `Collateral: $${p.collateral_usd.toFixed(2)}\n` +
      `Borrowed: $${p.borrowed_usd.toFixed(2)}`
    ).join('\n\n');

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Liquidation Risk for ${address}`,
        blocks: [
          {
            type: 'section',
            text: { type: 'mrkdwn', text }
          }
        ]
      })
    });
  }

  start() {
    console.log(`Starting monitor for ${this.addresses.length} addresses...`);
    this.checkPositions(); // Check immediately
    setInterval(() => this.checkPositions(), CHECK_INTERVAL);
  }
}

// Usage
const monitor = new LiquidationMonitor([
  '0xYourAddress1',
  '0xYourAddress2',
  '0xYourAddress3'
]);

monitor.start();
```

### 2. Portfolio Dashboard API (Express.js)

Build a backend API for a DeFi portfolio dashboard.

```javascript
// server.js
const express = require('express');
const app = express();

const KIXAGO_API = 'https://api.kixago.com/api/v1';

// In-memory cache (use Redis in production)
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds

app.get('/api/portfolio/:address', async (req, res) => {
  const { address } = req.params;
  const { chains } = req.query;

  try {
    // Check cache
    const cacheKey = `${address}:${chains || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ ...cached.data, cached: true });
    }

    // Fetch from Kixago
    let url = `${KIXAGO_API}/lending/positions?address=${address}`;
    if (chains) url += `&chains=${chains}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: data.error });
    }

    // Calculate portfolio summary
    const summary = calculateSummary(data.data.positions);

    // Fetch risk analysis
    const riskResponse = await fetch(
      `${KIXAGO_API}/risk/portfolio?address=${address}`
    );
    const riskData = await riskResponse.json();

    const result = {
      address,
      summary,
      positions: data.data.positions,
      risk: riskData.data,
      timestamp: new Date().toISOString()
    };

    // Cache result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    res.json(result);

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateSummary(positions) {
  const summary = {
    total_collateral_usd: 0,
    total_borrowed_usd: 0,
    net_value_usd: 0,
    protocols: new Set(),
    chains: new Set(),
    avg_health_factor: 0,
    positions_count: positions.length
  };

  let totalHF = 0;

  positions.forEach(pos => {
    summary.total_collateral_usd += pos.collateral_usd;
    summary.total_borrowed_usd += pos.borrowed_usd;
    summary.protocols.add(pos.protocol);
    summary.chains.add(pos.chain);
    totalHF += pos.health_factor;
  });

  summary.net_value_usd = summary.total_collateral_usd - summary.total_borrowed_usd;
  summary.avg_health_factor = positions.length > 0 ? totalHF / positions.length : 0;
  summary.protocols = Array.from(summary.protocols);
  summary.chains = Array.from(summary.chains);

  return summary;
}

app.listen(3000, () => {
  console.log('Portfolio API running on http://localhost:3000');
});
```

**Example Response:**

```json
{
  "address": "0xYourAddress",
  "summary": {
    "total_collateral_usd": 150000,
    "total_borrowed_usd": 60000,
    "net_value_usd": 90000,
    "protocols": ["aave", "compound"],
    "chains": ["ethereum", "polygon"],
    "avg_health_factor": 2.5,
    "positions_count": 3
  },
  "positions": [...],
  "risk": {...}
}
```

### 3. React Dashboard Component

A complete React component for displaying lending positions.

```tsx
// PositionsDashboard.tsx
import React, { useState, useEffect } from 'react';

interface Position {
  protocol: string;
  chain: string;
  collateral_usd: number;
  borrowed_usd: number;
  health_factor: number;
  is_at_risk: boolean;
  collateral_details: Array<{
    token: string;
    amount: number;
    usd_value: number;
    apy: number;
  }>;
  borrowed_details: Array<{
    token: string;
    amount: number;
    usd_value: number;
    apy: number;
  }>;
}

interface Props {
  address: string;
}

export const PositionsDashboard: React.FC<Props> = ({ address }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, [address]);

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.kixago.com/api/v1/lending/positions?address=${address}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }

      const data = await response.json();
      setPositions(data.data.positions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading positions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (positions.length === 0) {
    return <div className="empty">No lending positions found</div>;
  }

  const totalCollateral = positions.reduce((sum, p) => sum + p.collateral_usd, 0);
  const totalBorrowed = positions.reduce((sum, p) => sum + p.borrowed_usd, 0);
  const avgHealthFactor = positions.reduce((sum, p) => sum + p.health_factor, 0) / positions.length;

  return (
    <div className="dashboard">
      <div className="summary">
        <h2>Portfolio Summary</h2>
        <div className="stats">
          <div className="stat">
            <span className="label">Total Collateral</span>
            <span className="value">${totalCollateral.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Total Borrowed</span>
            <span className="value">${totalBorrowed.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Net Value</span>
            <span className="value">
              ${(totalCollateral - totalBorrowed).toLocaleString()}
            </span>
          </div>
          <div className="stat">
            <span className="label">Avg Health Factor</span>
            <span className={`value ${avgHealthFactor < 1.5 ? 'warning' : ''}`}>
              {avgHealthFactor.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="positions">
        <h2>Active Positions ({positions.length})</h2>
        {positions.map((position, idx) => (
          <PositionCard key={idx} position={position} />
        ))}
      </div>
    </div>
  );
};

const PositionCard: React.FC<{ position: Position }> = ({ position }) => {
  return (
    <div className={`position-card ${position.is_at_risk ? 'at-risk' : ''}`}>
      <div className="position-header">
        <h3>
          {position.protocol.toUpperCase()} on {position.chain}
        </h3>
        {position.is_at_risk && <span className="risk-badge">⚠️ At Risk</span>}
      </div>

      <div className="position-body">
        <div className="side">
          <h4>Collateral</h4>
          {position.collateral_details.map((token, idx) => (
            <div key={idx} className="token-row">
              <span className="token-name">{token.token}</span>
              <span className="token-amount">
                {token.amount.toFixed(4)}
              </span>
              <span className="token-value">
                ${token.usd_value.toLocaleString()}
              </span>
              <span className="token-apy">{token.apy.toFixed(2)}% APY</span>
            </div>
          ))}
          <div className="total">
            Total: ${position.collateral_usd.toLocaleString()}
          </div>
        </div>

        <div className="side">
          <h4>Borrowed</h4>
          {position.borrowed_details.map((token, idx) => (
            <div key={idx} className="token-row">
              <span className="token-name">{token.token}</span>
              <span className="token-amount">
                {token.amount.toFixed(4)}
              </span>
              <span className="token-value">
                ${token.usd_value.toLocaleString()}
              </span>
              <span className="token-apy">{token.apy.toFixed(2)}% APY</span>
            </div>
          ))}
          <div className="total">
            Total: ${position.borrowed_usd.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="position-footer">
        <div className="metric">
          <span className="label">Health Factor</span>
          <span className={`value ${position.health_factor < 1.5 ? 'warning' : ''}`}>
            {position.health_factor.toFixed(2)}
          </span>
        </div>
        <div className="metric">
          <span className="label">LTV</span>
          <span className="value">
            {(position.borrowed_usd / position.collateral_usd * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
```

### 4. Python Script: CSV Export

Export all positions to a CSV file for analysis.

```python
# export_positions.py
import csv
import requests
from datetime import datetime

def fetch_positions(address):
    """Fetch all positions for an address"""
    url = "https://api.kixago.com/api/v1/lending/positions"
    params = {"address": address}
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    
    data = response.json()
    return data["data"]["positions"]

def export_to_csv(positions, filename):
    """Export positions to CSV"""
    if not positions:
        print("No positions to export")
        return
    
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = [
            'protocol',
            'chain',
            'collateral_usd',
            'borrowed_usd',
            'health_factor',
            'ltv_current',
            'is_at_risk',
            'collateral_tokens',
            'borrowed_tokens',
            'timestamp'
        ]
        
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for pos in positions:
            # Aggregate token lists
            collateral_tokens = ', '.join([
                f"{t['token']}:{t['amount']:.4f}" 
                for t in pos['collateral_details']
            ])
            
            borrowed_tokens = ', '.join([
                f"{t['token']}:{t['amount']:.4f}" 
                for t in pos['borrowed_details']
            ])
            
            writer.writerow({
                'protocol': pos['protocol'],
                'chain': pos['chain'],
                'collateral_usd': pos['collateral_usd'],
                'borrowed_usd': pos['borrowed_usd'],
                'health_factor': pos['health_factor'],
                'ltv_current': pos['ltv_current'],
                'is_at_risk': pos['is_at_risk'],
                'collateral_tokens': collateral_tokens,
                'borrowed_tokens': borrowed_tokens,
                'timestamp': datetime.now().isoformat()
            })
    
    print(f"✅ Exported {len(positions)} positions to {filename}")

# Usage
if __name__ == "__main__":
    address = "0xYourAddress"
    positions = fetch_positions(address)
    
    filename = f"positions_{address[:10]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    export_to_csv(positions, filename)
```

### 5. Go: Concurrent Multi-Address Fetcher

Fetch positions for multiple addresses concurrently.

```go
// main.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type Position struct {
	Protocol      string  `json:"protocol"`
	Chain         string  `json:"chain"`
	CollateralUSD float64 `json:"collateral_usd"`
	BorrowedUSD   float64 `json:"borrowed_usd"`
	HealthFactor  float64 `json:"health_factor"`
}

type APIResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Positions []Position `json:"positions"`
	} `json:"data"`
}

type AddressResult struct {
	Address   string
	Positions []Position
	Error     error
	Duration  time.Duration
}

func fetchPositions(address string) ([]Position, error) {
	start := time.Now()
	
	url := fmt.Sprintf(
		"https://api.kixago.com/api/v1/lending/positions?address=%s",
		address,
	)
	
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	var result APIResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	
	fmt.Printf("✅ Fetched %s in %v\n", address[:10], time.Since(start))
	return result.Data.Positions, nil
}

func fetchMultipleAddresses(addresses []string) []AddressResult {
	results := make([]AddressResult, len(addresses))
	var wg sync.WaitGroup
	
	for i, address := range addresses {
		wg.Add(1)
		go func(idx int, addr string) {
			defer wg.Done()
			
			start := time.Now()
			positions, err := fetchPositions(addr)
			
			results[idx] = AddressResult{
				Address:   addr,
				Positions: positions,
				Error:     err,
				Duration:  time.Since(start),
			}
		}(i, address)
	}
	
	wg.Wait()
	return results
}

func main() {
	addresses := []string{
		"0xAddress1",
		"0xAddress2",
		"0xAddress3",
		"0xAddress4",
		"0xAddress5",
	}
	
	fmt.Printf("Fetching positions for %d addresses...\n", len(addresses))
	start := time.Now()
	
	results := fetchMultipleAddresses(addresses)
	
	fmt.Printf("\n📊 Results (completed in %v):\n\n", time.Since(start))
	
	totalPositions := 0
	for _, result := range results {
		if result.Error != nil {
			fmt.Printf("❌ %s: %v\n", result.Address[:10], result.Error)
			continue
		}
		
		fmt.Printf("✅ %s: %d positions (%.2fs)\n",
			result.Address[:10],
			len(result.Positions),
			result.Duration.Seconds(),
		)
		
		totalPositions += len(result.Positions)
		
		for _, pos := range result.Positions {
			fmt.Printf("   - %s on %s (HF: %.2f)\n",
				pos.Protocol, pos.Chain, pos.HealthFactor,
			)
		}
	}
	
	fmt.Printf("\nTotal: %d positions across %d addresses\n",
		totalPositions, len(addresses),
	)
}
```

### 6. Discord Bot Integration

Send liquidation alerts to Discord.

```javascript
// discord-bot.js
const { Client, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [] });
const CHANNEL_ID = 'your-channel-id';
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const watchList = [
  { address: '0xAddress1', name: 'Alice' },
  { address: '0xAddress2', name: 'Bob' },
];

async function checkPositions() {
  for (const user of watchList) {
    try {
      const response = await fetch(
        `https://api.kixago.com/api/v1/lending/positions?address=${user.address}`
      );
      const data = await response.json();
      
      const atRisk = data.data.positions.filter(p => p.health_factor < 1.5);
      
      if (atRisk.length > 0) {
        await sendDiscordAlert(user, atRisk);
      }
    } catch (error) {
      console.error(`Error checking ${user.name}:`, error);
    }
  }
}

async function sendDiscordAlert(user, positions) {
  const channel = await client.channels.fetch(CHANNEL_ID);
  
  const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle(`🚨 Liquidation Alert: ${user.name}`)
    .setDescription(`${positions.length} position(s) at risk`)
    .setTimestamp();
  
  positions.forEach(pos => {
    embed.addFields({
      name: `${pos.protocol.toUpperCase()} on ${pos.chain}`,
      value: 
        `Health Factor: **${pos.health_factor.toFixed(2)}**\n` +
        `Collateral: ${pos.collateral_usd.toLocaleString()}\n` +
        `Borrowed: ${pos.borrowed_usd.toLocaleString()}`,
      inline: true
    });
  });
  
  await channel.send({ embeds: [embed] });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  checkPositions(); // Check immediately
  setInterval(checkPositions, CHECK_INTERVAL);
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

## More Examples

- **[Telegram Bot](./telegram-bot)** - Liquidation alerts via Telegram
- **[GraphQL Wrapper](./graphql)** - Wrap Kixago API in GraphQL
- **[Webhook Handler](./webhooks)** - Process Kixago webhooks (coming soon)
- **[Next.js App](./nextjs)** - Full-stack Next.js portfolio app

## Tips for Production

1. **Always handle errors gracefully** - One protocol failing shouldn't break your app
2. **Cache aggressively** - Positions don't change every second
3. **Use concurrent requests** - Fetch multiple addresses in parallel
4. **Monitor health factors** - Alert users before liquidation
5. **Test with real addresses** - Use known DeFi users for realistic testing

## Need Help?

- **More examples**: [GitHub repository](https://github.com/kixago/defi-aggregator-api/tree/main/examples)
- **Ask questions**: [Open an issue](https://github.com/kixago/defi-aggregator-api/issues)
- **Community**: [Discord](https://discord.gg/kixago) (coming soon)
