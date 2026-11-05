import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      ".tmp-chrome-profile/**",
      ".tmp-chrome-profile-final/**",
      "node_modules/**",
      "projects/**/.next/**",
      "**/.netlify/**",
      "projects/**/public/_next/**",
    ],
  },
];

export default eslintConfig;
