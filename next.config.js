/** @type {import('next').NextConfig} */
const nextConfig = {
    images  : {
        domains: ['lh3.googleusercontent.com'],
    },
    experimental: {
        serverActions: true,
      },
      compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
      }
}

module.exports = nextConfig