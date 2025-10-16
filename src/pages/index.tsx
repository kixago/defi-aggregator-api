import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// Feature data for the homepage
const features = [
  {
    title: 'One API, All Protocols',
    icon: '📚',
    description:
      'Query Aave V2/V3, Compound V2/V3, and MakerDAO with a single, normalized endpoint. Stop building dozens of protocol-specific integrations.',
  },
  {
    title: 'Multi-Chain by Default',
    icon: '⚡',
    description:
      'Get instant, aggregated data across Ethereum, Polygon, Arbitrum, and Base. We handle the complexity of multi-chain routing and state decoding.',
  },
  {
    title: 'Developer-First Experience',
    icon: '🛠️',
    description:
      'Clear error handling, detailed OpenAPI specifications, and ready-to-use code examples ensure a smooth and predictable integration experience.',
  },
  {
    title: 'Real-Time Protocol State',
    icon: '🔄',
    description:
      'Direct blockchain queries with intelligent caching deliver sub-100ms responses for all your DeFi protocol position queries.',
  },
  {
    title: 'Enterprise-Ready Infrastructure',
    icon: '🏢',
    description:
      'Built on our own node infrastructure with 99.9% uptime SLA. No dependency on third-party RPC rate limits or availability.',
  },
  {
    title: 'Comprehensive Documentation',
    icon: '📖',
    description:
      'Detailed guides, working code examples in multiple languages, and interactive API reference powered by OpenAPI 3.1.',
  },
];

// Type definition for Feature props
interface FeatureProps {
  title: string;
  icon: string;
  description: string;
}

function Feature({title, icon, description}: FeatureProps) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Get Started - 5min ⚡
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/api">
            View API Reference →
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStartSection}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 className={styles.sectionTitle}>Quick Start: Get Your First Position</h2>
            <p className={styles.sectionSubtitle}>
              Get a user's combined lending positions across all protocols with a single API call.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col col--12">
            <div className={styles.codeBlockContainer}>
              <div className={styles.codeBlockHeader}>
                <span className={styles.codeBlockLang}>bash</span>
                <button className={styles.copyButton} onClick={() => {
                  navigator.clipboard.writeText(`# 1. Get your API Key
export KIXAGO_KEY="YOUR_API_KEY"

# 2. Query a user's positions (normalized response)
curl -H "Authorization: Bearer $KIXAGO_KEY" \\
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"

# Output will include data from Aave, Compound, MakerDAO, etc.`);
                }}>
                  Copy
                </button>
              </div>
              <pre className={styles.codeBlock}>
{`# 1. Get your API Key
export KIXAGO_KEY="YOUR_API_KEY"

# 2. Query a user's positions (normalized response)
curl -H "Authorization: Bearer $KIXAGO_KEY" \\
  "https://api.kixago.com/api/v1/lending/positions?address=0xYourAddress"

# Output will include data from Aave, Compound, MakerDAO, etc.`}
              </pre>
            </div>
          </div>
        </div>
        <div className="row" style={{marginTop: '2rem'}}>
          <div className="col col--4">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>50ms</div>
              <div className={styles.statLabel}>Avg Response Time</div>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5+</div>
              <div className={styles.statLabel}>Protocols Supported</div>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>Chains Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseSection() {
  return (
    <section className={styles.useCaseSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Built for Real-World Use Cases</h2>
        <div className="row">
          <div className="col col--6">
            <div className={styles.useCaseCard}>
              <h3>🚨 Liquidation Alert Systems</h3>
              <p>
                Monitor health factors across all protocols and chains. Alert users before positions reach critical levels.
              </p>
              <Link to="/docs/examples/liquidation-alerts">
                View Example →
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.useCaseCard}>
              <h3>📊 Portfolio Dashboards</h3>
              <p>
                Display unified portfolio views showing all lending positions, yields, and risks across DeFi protocols.
              </p>
              <Link to="/docs/examples/portfolio-dashboard">
                View Example →
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.useCaseCard}>
              <h3>💰 Yield Optimization</h3>
              <p>
                Compare lending opportunities across protocols and chains to help users maximize their yields.
              </p>
              <Link to="/docs/examples/yield-optimizer">
                View Example →
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.useCaseCard}>
              <h3>🏦 Institutional Risk Management</h3>
              <p>
                Enterprise-grade risk analytics for large DeFi positions with real-time monitoring and reporting.
              </p>
              <Link to="/docs/examples/risk-management">
                View Example →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <h2>Ready to Simplify Your DeFi Integration?</h2>
        <p>Join developers who are already building with Kixago</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Start Building Now
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/kixago/defi-aggregator-api"
            target="_blank"
            rel="noopener noreferrer">
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="The unified API for multi-chain DeFi protocol data. Query Aave, Compound, MakerDAO and more with a single endpoint.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <QuickStartSection />
        <UseCaseSection />
        <CTASection />
      </main>
    </Layout>
  );
}
