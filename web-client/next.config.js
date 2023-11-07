/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5199/api/:path*'
            }
        ]
    }
}

module.exports = nextConfig
