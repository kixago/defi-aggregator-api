import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    // Introduction
    'intro',
    'whitepaper',

    // Quick Start (top level)
    'quickstart/setup',

    // API Documentation
    {
      type: 'category',
      label: 'API Documentation',
      collapsed: false,
      items: [
        // Authentication
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

        // Understanding Responses (FIXED: understand not understanding)
        {
          type: 'category',
          label: 'Understanding Responses',
          collapsed: true,
          items: [
            'api/understand-responses/overview',
            'api/understand-responses/defi-score',
            'api/understand-responses/liquidation-simulation',
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
            'api/examples/ruby',
            'api/examples/rust',
            'api/examples/swift',
            'api/examples/java',
            'api/examples/kotlin',
            'api/examples/csharp',
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
