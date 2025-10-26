import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

function HomepageHeader() {
  return (
    <header className="hero-banner">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">DeFi Credit Intelligence API</h1>
          <p className="hero-subtitle">The FICO Score for Decentralized Finance</p>
          <p className="hero-tagline">
            One API call returns complete lending positions across Aave, Compound, and MakerDAO 
            with FICO-style credit scores (300-850), liquidation risk analysis, and actionable recommendations.
          </p>
          <div className="hero-buttons">
            <Link
              className="button button--primary button--lg btn-hero-primary"
              to="/docs/intro">
              Get Started in 5 Minutes ⚡
            </Link>
            <Link
              className="button button--secondary button--lg btn-hero-secondary"
              to="/docs/intro">
              View API Reference →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureSection() {
  const features = [
    {
      title: 'One API, All Protocols',
      icon: '🔗',
      description: 'Query Aave V2/V3, Compound V2/V3, and MakerDAO with a single, normalized endpoint. Stop building dozens of protocol-specific integrations.',
    },
    {
      title: 'Multi-Chain by Default',
      icon: '⛓️',
      description: 'Get instant, aggregated data across Ethereum, Polygon, Arbitrum, and Base. We handle the complexity of multi-chain routing.',
    },
    {
      title: 'DeFi Credit Scoring',
      icon: '📊',
      description: 'FICO-style scores (300-850) with detailed risk breakdowns, liquidation scenarios, and personalized recommendations.',
    },
    {
      title: 'Real-Time Analysis',
      icon: '⚡',
      description: 'Direct blockchain queries with intelligent caching deliver sub-100ms responses for all DeFi position queries.',
    },
    {
      title: 'Enterprise Infrastructure',
      icon: '🏢',
      description: 'Built on our own node infrastructure with 99.9% uptime SLA. No dependency on third-party rate limits.',
    },
    {
      title: 'Developer First',
      icon: '🛠️',
      description: 'Clear error handling, detailed OpenAPI specs, and ready-to-use code examples in multiple languages.',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Everything You Need for DeFi Intelligence</h2>
        <p className="section-subtitle">
          Built by developers who understand the pain of integrating multiple DeFi protocols
        </p>
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4" style={{ marginBottom: '2rem' }}>
              <div className="feature-card" style={{ '--index': idx } as React.CSSProperties}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveExampleSection() {
  const exampleCode = `# Get DeFi credit score and risk analysis
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.kixago.com/v1/risk-profile/0xf0bb20865277aBd641a307eCe5Ee04E79073416C"

# Response (actual $2.2B whale position):
{
  "defi_score": 467,
  "risk_level": "High Risk",
  "total_collateral_usd": 2175957718.47,
  "total_borrowed_usd": 1905081695.88,
  "global_health_factor": 1.067,
  
  "risk_factors": [{
    "severity": "critical",
    "factor": "Imminent Liquidation Risk",
    "description": "Position will be liquidated if collateral drops 6.7%"
  }],
  
  "recommendations": {
    "immediate": ["🚨 URGENT: Deposit $387M more collateral OR repay debt"]
  }
}`;

  return (
    <section className="example-section">
      <div className="container">
        <h2 className="section-title">See It In Action</h2>
        <p className="section-subtitle">
          Real-time analysis of a $2.2B DeFi whale position
        </p>
        <div className="row">
          <div className="col col--12">
            <div className="code-showcase">
              <CodeBlock language="bash" children={exampleCode} />
            </div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">1-2s</div>
            <div className="stat-label">Response Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5+</div>
            <div className="stat-label">Protocols Supported</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4</div>
            <div className="stat-label">Chains Aggregated</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCaseSection() {
  const useCases = [
    {
      icon: '🏦',
      title: 'Banks & Lenders',
      subtitle: 'Underwrite Crypto-Native Borrowers',
      description: 'Verify DeFi collateral and assess liquidation risk for loan applications.',
      example: 'A borrower with $10M in DeFi can now get traditional financing.',
    },
    {
      icon: '💼',
      title: 'Wealth Advisors',
      subtitle: 'DeFi Portfolio Oversight',
      description: 'Monitor client DeFi positions and provide risk management advice.',
      example: 'Turn DeFi monitoring into a billable advisory service.',
    },
    {
      icon: '🚨',
      title: 'Risk Management',
      subtitle: 'Liquidation Prevention',
      description: 'Alert users before positions reach dangerous health factors.',
      example: 'Save millions in liquidation penalties with proactive alerts.',
    },
    {
      icon: '🤖',
      title: 'Trading Bots',
      subtitle: 'Liquidation Hunting',
      description: 'Monitor whale positions for profitable liquidation opportunities.',
      example: 'Sub-100ms responses enable real-time opportunity detection.',
    },
    {
      icon: '📱',
      title: 'DeFi Dashboards',
      subtitle: 'Complete Portfolio Views',
      description: 'Show users all their positions across protocols in one place.',
      example: 'Ship in 5 minutes instead of 3 months of integration work.',
    },
    {
      icon: '📈',
      title: 'Yield Optimization',
      subtitle: 'Find Best Rates',
      description: 'Compare lending rates across all protocols and chains instantly.',
      example: 'Help users maximize yields while managing risk.',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Built for Real-World Use Cases</h2>
        <p className="section-subtitle">
          From institutional risk management to DeFi dashboards
        </p>
        <div className="use-case-grid">
          {useCases.map((useCase, idx) => (
            <div key={idx} className="use-case-card">
              <h3 className="use-case-title">
                <span className="use-case-icon">{useCase.icon}</span>
                {useCase.title}
              </h3>
              <h4 className="use-case-subtitle">{useCase.subtitle}</h4>
              <p className="use-case-description">{useCase.description}</p>
              <p className="use-case-example">
                <strong>Example:</strong> {useCase.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreExplanationSection() {
  const scoreRanges = [
    {
      range: '750-850',
      level: 'Very Low Risk',
      badge: { text: 'SAFE', className: 'risk-low' },
      description: 'Healthy positions, low leverage',
      action: 'Green light for borrowing',
      rowClass: 'score-row-safe',
    },
    {
      range: '650-749',
      level: 'Low Risk',
      badge: null,
      description: 'Conservative borrowing',
      action: 'Monitor occasionally',
      rowClass: '',
    },
    {
      range: '550-649',
      level: 'Medium Risk',
      badge: { text: 'WATCH', className: 'risk-medium' },
      description: 'Moderate leverage',
      action: 'Watch closely',
      rowClass: 'score-row-warning',
    },
    {
      range: '450-549',
      level: 'High Risk',
      badge: null,
      description: 'Approaching danger zone',
      action: 'Reduce leverage soon',
      rowClass: '',
    },
    {
      range: '300-449',
      level: 'Very High Risk',
      badge: { text: 'DANGER', className: 'risk-high' },
      description: 'Imminent liquidation risk',
      action: 'Take action NOW',
      rowClass: 'score-row-danger',
    },
  ];

  return (
    <section className="example-section">
      <div className="container">
        <h2 className="section-title">Understanding DeFi Credit Scores</h2>
        <p className="section-subtitle">
          Transparent, quantifiable risk assessment using a 5-factor model
        </p>
        <div className="row">
          <div className="col col--12">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Score Range</th>
                  <th>Risk Level</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scoreRanges.map((score, idx) => (
                  <tr key={idx} className={score.rowClass}>
                    <td><strong>{score.range}</strong></td>
                    <td>
                      {score.level}
                      {score.badge && (
                        <span className={`risk-badge ${score.badge.className}`}>
                          {score.badge.text}
                        </span>
                      )}
                    </td>
                    <td>{score.description}</td>
                    <td>{score.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col col--12">
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>5-Factor Scoring Model</h3>
            <div className="row">
              <div className="col col--6">
                <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li><strong>Health Factor (40%)</strong> - Proximity to liquidation</li>
                  <li><strong>Leverage Ratio (30%)</strong> - Debt-to-collateral ratio</li>
                  <li><strong>Diversification (15%)</strong> - Concentration risk</li>
                </ul>
              </div>
              <div className="col col--6">
                <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li><strong>Volatility (10%)</strong> - Collateral asset risk</li>
                  <li><strong>Protocol Risk (5%)</strong> - Smart contract maturity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Build with DeFi Intelligence?</h2>
          <p className="cta-subtitle">
            Join developers who are shipping DeFi features in minutes, not months
          </p>
          <div className="cta-buttons">
            <Link
              className="button button--primary button--lg btn-hero-primary btn-shine"
              to="/docs/intro">
              Start Free Trial
            </Link>
            <Link
              className="button button--secondary button--lg btn-hero-secondary"
              to="/docs/intro">
              Read Documentation
            </Link>
          </div>
          <p className="cta-note">
            Free tier includes 10,000 API calls per month • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const trustedBy = [
    { icon: '🏦', text: 'DeFi Lenders' },
    { icon: '📊', text: 'Analytics Platforms' },
    { icon: '🤖', text: 'Trading Bots' },
    { icon: '💼', text: 'Wealth Advisors' },
    { icon: '🚨', text: 'Risk Managers' },
  ];

  return (
    <section className="trusted-section">
      <div className="container">
        <h3 className="trusted-title">
          Trusted by Leading DeFi Teams
        </h3>
        <div className="trusted-logos">
          {trustedBy.map((item, idx) => (
            <div key={idx} className="trusted-logo">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="DeFi Credit Intelligence API"
      description="The FICO Score for DeFi. One API for complete lending positions across Aave, Compound, and MakerDAO with credit scoring and liquidation risk analysis.">
      <HomepageHeader />
      <main>
        <FeatureSection />
        <LiveExampleSection />
        <ScoreExplanationSection />
        <UseCaseSection />
        <TrustedBySection />
        <CTASection />
      </main>
    </Layout>
  );
}
