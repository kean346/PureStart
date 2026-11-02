import packageJson from "../../package.json";
export const APP_CONFIG = {
  name: "NOREVA",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://noreva.example"),
  repository: "https://github.com/kean346/dashboard-2-",
  version: packageJson.version,
  copyright: "Fictional concept · Built by paceIT",
  meta: {
    title: "NOREVA Insights | Analytics & Intelligence",
    description:
      "A fictional analytics and intelligence platform. A portfolio concept by paceIT, built on the MIT-licensed Studio Admin foundation.",
  },
};
