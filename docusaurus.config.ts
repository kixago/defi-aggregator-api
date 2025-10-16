import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // ------------------------------------------------------------
  // 1. SITE METADATA - Kixago Updates
  // ------------------------------------------------------------
  title: 'Kixago DeFi Aggregator API',
  tagline: 'The unified API for multi-chain DeFi protocol data.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/api/docusaurus-config#future
  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://docs.kixago.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'kixago',
  projectName: 'defi-aggregator-api',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // ------------------------------------------------------------
  // 2. PLUGINS ARRAY - FIXED OPENAPI INTEGRATION
  // ------------------------------------------------------------
  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "api",
        docsPluginId: "classic", // Links to the preset's docs plugin
        
        config: {
          "api-reference": { 
            specPath: "./openapi.yaml",
            outputDir: "docs/api/positions",
            sidebarOptions: {
              groupPathsBy: "tag",
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
          // IMPORTANT: Add this to use the OpenAPI theme component
          docItemComponent: "@theme/ApiItem",
          editUrl:
            'https://github.com/kixago/defi-aggregator-api/tree/main/docs-site/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/kixago/defi-aggregator-api/tree/main/docs-site/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // ------------------------------------------------------------
  // 3. ADD THE OPENAPI THEME
  // ------------------------------------------------------------
  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig: {
    image: 'img/kixago-social-card.jpg',
    colorMode: {
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
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
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
          title: 'Docs',
          items: [
            {
              label: 'Quickstart',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kixago/defi-aggregator-api',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kixago, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
