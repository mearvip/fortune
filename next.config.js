/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    },
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          ],
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: '/api/tarot-reading',
          destination: 'https://api.siliconflow.cn/v1/chat/completions'
        }
      ]
    }
  }
  
  module.exports = nextConfig