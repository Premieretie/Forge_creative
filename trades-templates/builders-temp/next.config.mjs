/** @type {import('next').NextConfig} */

// GitHub Pages configuration
// Set GITHUB_PAGES=true and REPO_NAME=your-repo-name when deploying to GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.REPO_NAME || 'builders-temp';

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  // GitHub Pages specific settings
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
