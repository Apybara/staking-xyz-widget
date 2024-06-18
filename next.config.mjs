import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/path/:path*",
  //       has: [
  //         {
  //           type: "query",
  //           key: "network",
  //           value: "aleo",
  //         },
  //       ],
  //       destination: "https://aleo.staking.xyz",
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default withVanillaExtract(nextConfig);
