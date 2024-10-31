/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable source maps in development
    if (!isServer) {
      config.devtool = 'eval'
    }
    return config
  },
  // Add this to prevent source map warnings
  productionBrowserSourceMaps: false
}

module.exports = nextConfig 