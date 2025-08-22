/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_BASE_URL: process.env.GEMINI_BASE_URL || 'http://localhost:8080',
    MAX_TEXT_LENGTH: process.env.MAX_TEXT_LENGTH || '20000',
    AUTO_ANALYSIS_DELAY: process.env.AUTO_ANALYSIS_DELAY || '500',
  },
}

module.exports = nextConfig