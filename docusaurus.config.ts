import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Kixago DeFi API Documentation',
  tagline: 'The FICO Score for DeFi - Complete credit intelligence API',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.kixago.com',
  baseUrl: '/',

  organizationName: 'kixago',
  projectName: 'defi-aggregator-api',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // ------------------------------------------------------------
  // PLUGINS - Fixed OpenAPI Integration
  // ------------------------------------------------------------
  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "api",
        docsPluginId: "classic",
        
        config: {
          "api-reference": { 
            specPath: "./openapi.yaml",
            outputDir: "docs/api/generated", // Changed to avoid conflicts
            sidebarOptions: {
              groupPathsBy: "tag",
              sidebarCollapsed: false,
            },
          },
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          docItemComponent: "@theme/ApiItem",
          editUrl: 'https://github.com/kixago/defi-aggregator-api/tree/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false, // Disable blog completely
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    "docusaurus-theme-openapi-docs",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/kixago-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kixago API',
      logo: {
        alt: 'Kixago Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar', // Only one sidebar for now
          position: 'left',
          label: 'Documentation',
        },
        // Removed the apiSidebar reference - it doesn't exist
        // Removed blog link - blog is disabled
        {
          href: 'https://github.com/kixago/defi-aggregator-api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Get Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api/endpoints/risk-profile', // Fixed - this exists
            },
            {
              label: 'Code Examples',
              to: '/docs/api/examples/javascript',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kixago/defi-aggregator-api',
            },
            {
              label: 'Get API Key',
              href: 'https://kixago.com/dashboard',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kixago, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'javascript', 'typescript', 'python', 'go', 'rust', 'java', 'kotlin', 'swift', 'php', 'ruby', 'csharp'],
    },
    stylesheets: [ {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    }],
  } satisfies Preset.ThemeConfig,
};

export default config;
