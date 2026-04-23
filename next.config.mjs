const repository = process.env.GITHUB_REPOSITORY || '';
const [owner = '', repoName = ''] = repository.split('/');
const isProjectPagesRepo = process.env.GITHUB_ACTIONS === 'true'
  && !!repoName
  && repoName.toLowerCase() !== `${owner}.github.io`.toLowerCase();

const basePath = isProjectPagesRepo ? `/${repoName}` : '';
const siteUrl = owner
  ? `https://${owner}.github.io${basePath}`
  : 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;
