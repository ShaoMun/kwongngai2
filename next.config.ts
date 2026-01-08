import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Empty turbopack config to silence warning
  turbopack: {},

  webpack: (config, { isServer }) => {
    // Handle .glb files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files/',
          outputPath: 'static/files/',
          name: '[name].[hash].[ext]',
        },
      },
    });

    // Transpile three.js modules for client-side rendering
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': require.resolve('three'),
      };
    }

    return config;
  },
};

export default nextConfig;
