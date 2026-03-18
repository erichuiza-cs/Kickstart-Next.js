/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/contentstack-image-loader.ts',
    // Comprehensive widths for 1x, 2x, and 3x devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME
        ? [{ hostname: process.env.NEXT_PUBLIC_CONTENTSTACK_IMAGE_HOSTNAME }]
        : [
            { hostname: "images.contentstack.io" },
            { hostname: "*-images.contentstack.com" },
          ]),
    ],
  },
};

export default nextConfig;
