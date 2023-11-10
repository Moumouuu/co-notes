/** @type {import('next').NextConfig} */
const nextConfig = {
    images  : {
        domains: ['lh3.googleusercontent.com'],
    },
    experimental : {
      serverComponentsExternalPackages: ["puppeteer"],
    },
      compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
      }
    }

module.exports = nextConfig