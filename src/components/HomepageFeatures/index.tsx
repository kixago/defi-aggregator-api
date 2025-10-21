import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'One API, All Protocols',
    icon: '📚',
    description: (
      <>
        Query Aave V2/V3, Compound V2/V3, and MakerDAO with a single, 
        normalized endpoint. Stop building dozens of protocol-specific integrations.
      </>
    ),
  },
  {
    title: 'Multi-Chain by Default',
    icon: '⚡',
    description: (
      <>
        Get instant, aggregated data across Ethereum, Polygon, Arbitrum, 
        and Base. We handle the complexity of multi-chain routing and state decoding.
      </>
    ),
  },
  {
    title: 'DeFi Credit Scoring',
    icon: '📊',
    description: (
      <>
        FICO-style credit scores (300-850) for DeFi positions with 
        liquidation risk analysis and actionable recommendations.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
