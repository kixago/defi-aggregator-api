import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/positions/kixago-defi-aggregator-api",
    },
    {
      type: "category",
      label: "Lending",
      items: [
        {
          type: "doc",
          id: "api/positions/retrieve-aggregated-lending-positions-for-a-user-address",
          label: "Retrieve aggregated lending positions for a user address.",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
