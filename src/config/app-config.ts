import packageJson from "../../package.json";
export const APP_CONFIG = {
  name: "WINGLO",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://winglo.example"),
  repository: "https://github.com/kean346/winglodashboard",
  version: packageJson.version,
  copyright: "Cleaning services · Demo workspace",
  meta: {
    title: "Winglo | Cleaning Services Management",
    description: "An interactive cleaning services demo. Sample data and estimates; no real messages sent.",
  },
};
