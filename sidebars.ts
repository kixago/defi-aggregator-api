// docs-site/sidebars.ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    // Introduction
    'intro',
    'whitepaper',
 
    // API Documentation
    {
      type: 'category',
      label: 'API Documentation',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'api/index',
      },
      items: [
        // Getting Started
        'api/quickstart',
        'api/authentication',
        
        // Endpoints
        {
          type: 'category',
          label: 'API Endpoints',
          collapsed: false,
          items: [
            'api/endpoints/risk-profile',
            'api/endpoints/health',
          ],
        },
        
        // Understanding Responses
        {
          type: 'category',
          label: 'Understanding Responses',
          collapsed: true,
          items: [
            'api/understanding-responses/overview',
            'api/understanding-responses/defi-score',
            'api/understanding-responses/liquidation-simulation',
          ],
        },
        
        // Code Examples
        {
          type: 'category',
          label: 'Code Examples',
          collapsed: true,
          items: [
            'api/examples/javascript',
            'api/examples/python',
            'api/examples/go',
            'api/examples/php',
          ],
        },
        
        // Guides
        {
          type: 'category',
          label: 'Guides',
          collapsed: true,
          items: [
            'api/guides/error-handling',
            'api/guides/best-practices',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
