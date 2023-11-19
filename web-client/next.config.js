/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/be/:path*',
                destination: 'http://localhost:5199/api/:path*'
            }
        ]
    }
}

module.exports = nextConfig
