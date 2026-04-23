const repository = process.env.GITHUB_REPOSITORY || '';
const [owner = '', repoName = ''] = repository.split('/');
const isProjectPagesRepo = process.env.GITHUB_ACTIONS === 'true'
  && !!repoName
  && repoName.toLowerCase() !== `${owner}.github.io`.toLowerCase();

const basePath = isProjectPagesRepo ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;
