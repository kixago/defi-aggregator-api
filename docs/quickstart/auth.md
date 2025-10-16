---
sidebar_position: 2
---

# Authentication

All API requests require authentication using an API key.

## Getting Your API Key

### 1. Sign Up

Visit [kixago.com/dashboard](https://kixago.com/dashboard) to create your account.

### 2. Generate API Key

Once logged in:
1. Click "Create New API Key"
2. Give it a name (e.g., "Production App", "Development")
3. Click "Generate"

### 3. Save Your Key

Your API key will look like this:

```
kixakey_7eBHF9Ndxd_7eBHF9Ndxdq-I3q4Ds4nULLPQd-vElx9KC8fa6NDZiw
```

⚠️ **Important:** API keys are only shown once! Save it immediately in a secure location.

## Using Your API Key

### Method 1: Authorization Header (Recommended)

Add your API key as a Bearer token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer kixakey_YOUR_KEY_HERE" \
  "https://api.kixago.com/api/v1/lending/positions?address=0x..."
```

**Code Example (JavaScript):**

```javascript
const KIXAGO_API_KEY = process.env.KIXAGO_API_KEY;

const response = await fetch(
  'https://api.kixago.com/api/v1/lending/positions?address=0x...',
  {
    headers: {
      'Authorization': `Bearer ${KIXAGO_API_KEY}`
    }
  }
);
```

**Why use headers:**
- ✅ More secure (not logged in server access logs)
- ✅ Standard REST API practice
- ✅ Easier to rotate keys
- ✅ Works with all HTTP clients

### Method 2: Query Parameter (Alternate)

Add your API key as a query parameter:

```bash
curl "https://api.kixago.com/api/v1/lending/positions?address=0x...&api-key=kixakey_YOUR_KEY_HERE"
```

**Code Example (JavaScript):**

```javascript
const KIXAGO_API_KEY = process.env.KIXAGO_API_KEY;

const url = `https://api.kixago.com/api/v1/lending/positions?address=0x...&api-key=${KIXAGO_API_KEY}`;
const response = await fetch(url);
```

**When to use query parameters:**
- Quick testing in browser
- Debugging (easier to see the full URL)
- Webhooks that need embedded authentication

⚠️ **Security Note:** Query parameters may be logged by proxies and servers. Use the header method in production.

## Storing API Keys Securely

### ❌ DON'T Do This

```javascript
// Never hardcode API keys!
const API_KEY = "kixakey_7eBHF9Ndxd_...";
```

```python
# Don't commit keys to Git!
API_KEY = "kixakey_7eBHF9Ndxd_..."
```

### ✅ DO This Instead

**Environment Variables:**

```bash
# .env file (add to .gitignore!)
KIXAGO_API_KEY=kixakey_7eBHF9Ndxd_...
```

```javascript
// Load from environment
const API_KEY = process.env.KIXAGO_API_KEY;
```

```python
# Load from environment
import os
API_KEY = os.getenv('KIXAGO_API_KEY')
```

**Secret Management Services:**
- AWS Secrets Manager
- Google Cloud Secret Manager
- HashiCorp Vault
- Environment variables in Vercel/Netlify/Heroku

## Rate Limits

### Current Limits

| Plan | Requests/Minute | Requests/Month |
|------|----------------|----------------|
| **Free** | 60 | 100,000 |
| **Starter** | 300 | 1,000,000 |
| **Pro** | 1,000 | 5,000,000 |
| **Enterprise** | Unlimited | Unlimited |

### Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1697500800
```

**Example: Handling Rate Limits**

```javascript
const response = await fetch(url, { headers });

const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (remaining < 10) {
  console.warn(`Only ${remaining} requests left!`);
  console.warn(`Resets at ${new Date(reset * 1000)}`);
}
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "Rate limit exceeded. Limit resets at 2025-10-15T15:00:00Z",
  "timestamp": "2025-10-15T14:45:00Z"
}
```

**HTTP Status:** `429 Too Many Requests`

## Error Responses

### Missing API Key

```bash
curl "https://api.kixago.com/api/v1/lending/positions?address=0x..."
```

**Response:**
```json
{
  "success": false,
  "error": "Unauthorized. Authorization: Bearer <key> header or ?api-key=<key> parameter required.",
  "timestamp": "2025-10-15T14:30:00Z"
}
```

**HTTP Status:** `401 Unauthorized`

### Invalid API Key

```bash
curl -H "Authorization: Bearer kixakey_invalid" \
  "https://api.kixago.com/api/v1/lending/positions?address=0x..."
```

**Response:**
```json
{
  "success": false,
  "error": "Invalid API key",
  "timestamp": "2025-10-15T14:30:00Z"
}
```

**HTTP Status:** `401 Unauthorized`

## Managing API Keys

### In the Dashboard

Visit [kixago.com/dashboard](https://kixago.com/dashboard) to:

- **View all keys** - See all active API keys
- **Create new keys** - Generate keys for different environments
- **Rotate keys** - Create new key, update apps, delete old key
- **Delete keys** - Revoke access immediately
- **View usage** - See request counts per key

### Best Practices

1. **Use separate keys for each environment**
   ```
   kixakey_dev_...     # Development
   kixakey_staging_... # Staging
   kixakey_prod_...    # Production
   ```

2. **Rotate keys regularly**
   - Every 90 days for production keys
   - Immediately if compromised

3. **Delete unused keys**
   - Remove keys when projects are deprecated
   - Revoke keys for team members who leave

4. **Monitor usage**
   - Check dashboard for unexpected spikes
   - Alert on rate limit warnings

## Pricing

### Free Tier

Perfect for testing and small projects:
- ✅ 60 requests/minute
- ✅ 100,000 requests/month
- ✅ All endpoints
- ✅ Community support

### Paid Tiers

| Feature | Starter ($29/mo) | Pro ($99/mo) | Enterprise (Custom) |
|---------|-----------------|-------------|---------------------|
| **Requests/Min** | 300 | 1,000 | Unlimited |
| **Requests/Month** | 1,000,000 | 5,000,000 | Unlimited |
| **Support** | Email | Priority Email | Dedicated Slack |
| **SLA** | - | 99.9% | 99.99% |
| **Webhooks** | ✅ | ✅ | ✅ |
| **Custom Chains** | - | ✅ | ✅ |
| **On-Premise** | - | - | ✅ |

**[View Full Pricing →](https://kixago.com/pricing)**

## FAQ

### Can I use multiple API keys?

Yes! We recommend using separate keys for:
- Different environments (dev, staging, prod)
- Different applications
- Different team members (for audit trails)

### What happens if I lose my API key?

API keys are only shown once when created. If you lose it:
1. Generate a new API key
2. Update your applications with the new key
3. Delete the old key once migration is complete

### Can I change my rate limit?

Yes! Upgrade your plan in the dashboard to get higher rate limits immediately.

### Do API keys expire?

No, API keys don't expire automatically. You can revoke them manually at any time.

### Can I test without an API key?

No, all requests require authentication. However, signing up is free and takes 30 seconds.

## Self-Hosting (No API Keys Needed)

If you prefer to run Kixago yourself without API keys:

```bash
git clone https://github.com/kixago/defi-aggregator-api
cd defi-aggregator-api

# Set environment variables
cp .env.example .env

# Disable auth (optional for self-hosting)
echo "AUTH_REQUIRED=false" >> .env

# Start with Docker
docker-compose up -d
```

**[Self-Hosting Guide →](../self-hosting/docker)**

---

**Need help?** Email support@kixago.com or visit [kixago.com/dashboard](https://kixago.com/dashboard)

Here's what we're planning (subject to change):

| Tier | Price | Requests/Minute | Requests/Month | Features |
|------|-------|----------------|----------------|----------|
| **Free** | $0 | 60 | 100,000 | Perfect for testing and small projects |
| **Starter** | $29/mo | 300 | 1,000,000 | Analytics, email support |
| **Pro** | $99/mo | 1,000 | 5,000,000 | Webhooks, priority support, custom chains |
| **Enterprise** | Custom | Unlimited | Unlimited | SLA, dedicated support, on-premise option |

## Why Charge Later?

Kixago runs real blockchain infrastructure:
- Ethereum, Polygon, Arbitrum, and Base RPC nodes
- Redis caching layer (Valkey)
- PostgreSQL for persistent data
- 24/7 monitoring and uptime

This costs money to operate. But we want developers to build first, pay later when they have traction.

## Fair Use Policy (Current)

While we're in beta with no auth:

**Please don't:**
- Run automated scrapers hitting us every second
- Share API access with thousands of users
- Use us as a free production database
- Mine data for resale

**Please do:**
- Build your app
- Test thoroughly
- Give us feedback
- Report bugs
- Star us on GitHub 😉

If you're going to production with high volume, [email us](mailto:support@kixago.com) so we can ensure stability for everyone.

## Future: How Authentication Will Work

When we launch API keys, here's how it'll work:

### 1. Get Your API Key

```bash
# Visit https://dashboard.kixago.com
# Sign up with email or GitHub
# Copy your API key
```

### 2. Add to Requests

**Option A: Query Parameter** (easy, less secure)

```bash
curl "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress&api_key=kix_live_abc123"
```

**Option B: Header** (recommended, more secure)

```bash
curl -H "Authorization: Bearer kix_live_abc123" \
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"
```

### 3. Code Examples (Future)

**JavaScript:**
```javascript
const KIXAGO_API_KEY = process.env.KIXAGO_API_KEY;

async function getPositions(address) {
  const response = await fetch(
    `https://api.kixago.com/api/v1/lending/positions?address=${address}`,
    {
      headers: {
        'Authorization': `Bearer ${KIXAGO_API_KEY}`
      }
    }
  );
  return response.json();
}
```

**Python:**
```python
import os
import requests

KIXAGO_API_KEY = os.getenv('KIXAGO_API_KEY')

def get_positions(address):
    headers = {'Authorization': f'Bearer {KIXAGO_API_KEY}'}
    url = f"https://api.kixago.com/api/v1/lending/positions"
    params = {'address': address}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

**Go:**
```go
apiKey := os.Getenv("KIXAGO_API_KEY")

req, _ := http.NewRequest("GET", url, nil)
req.Header.Set("Authorization", "Bearer "+apiKey)

client := &http.Client{}
resp, err := client.Do(req)
```

## Rate Limit Headers (Future)

When we add rate limits, responses will include:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1634567890
```

**Handle them in your code:**

```javascript
const response = await fetch(url, { headers });

const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (remaining < 10) {
  console.warn(`Only ${remaining} requests left until ${new Date(reset * 1000)}`);
}
```

## Webhooks (Coming Soon)

Instead of polling our API every minute, subscribe to position updates:

```json
POST https://api.kixago.com/api/v1/webhooks

{
  "url": "https://your-app.com/webhook",
  "events": ["position.updated", "position.at_risk"],
  "addresses": ["0xYourAddress1", "0xYourAddress2"]
}
```

**When health factor drops below 1.5, you get:**

```json
POST https://your-app.com/webhook

{
  "event": "position.at_risk",
  "data": {
    "address": "0xYourAddress",
    "protocol": "aave",
    "chain": "ethereum",
    "health_factor": 1.4,
    "timestamp": "2025-10-15T14:30:00Z"
  }
}
```

## Self-Hosting (Always Free)

Don't want to pay? Run Kixago yourself:

```bash
git clone https://github.com/kixago/defi-aggregator-api
cd defi-aggregator-api
docker-compose up -d
```

See the [Self-Hosting Guide](../self-hosting/docker) for full instructions.

You'll need:
- Your own RPC endpoints (Alchemy, Infura, or your own nodes)
- Redis/Valkey for caching
- PostgreSQL for persistence (optional)

The code is MIT licensed. Do whatever you want with it.

## Stay Updated

Want to know when we launch authentication?

- 📧 **Email**: [Subscribe to updates](https://kixago.com/subscribe)
- 🐙 **GitHub**: [Watch releases](https://github.com/kixago/defi-aggregator-api)
- 🐦 **Twitter**: [@kixago_api](https://x.com/kixago_api) (coming soon)
- 💬 **Discord**: [Join community](https://discord.gg/kixago) (coming soon)

---

**For now:** Just use the API. Build cool stuff. We'll give you plenty of warning before requiring API keys.
