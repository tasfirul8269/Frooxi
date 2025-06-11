import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Website configuration
const siteConfig = {
  url: 'https://frooxi.com',
  defaultImage: 'https://frooxi.com/images/og-image.jpg',
  lastMod: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
};

// Define routes with metadata
const routes = [
  // Main pages
  { url: '/', changefreq: 'daily', priority: '1.0' },
  
  // Services
  { url: '/services', changefreq: 'weekly', priority: '0.9' },
  { url: '/services/web-development', changefreq: 'weekly', priority: '0.9' },
  { url: '/services/app-development', changefreq: 'weekly', priority: '0.9' },
  { url: '/services/seo', changefreq: 'weekly', priority: '0.9' },
  { url: '/services/cyber-security', changefreq: 'weekly', priority: '0.9' },
  { url: '/services/ui-ux-design', changefreq: 'weekly', priority: '0.9' },
  
  // Portfolio
  { url: '/portfolio', changefreq: 'weekly', priority: '0.9' },
  
  // Company
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/team', changefreq: 'monthly', priority: '0.8' },
  { url: '/careers', changefreq: 'monthly', priority: '0.7' },
  
  // Resources
  { url: '/blog', changefreq: 'daily', priority: '0.8' },
  { url: '/case-studies', changefreq: 'weekly', priority: '0.8' },
  
  // Contact
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/get-a-quote', changefreq: 'monthly', priority: '0.7' },
  
  // Legal
  { url: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
  { url: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
  { url: '/cookie-policy', changefreq: 'yearly', priority: '0.5' },
];

// Generate sitemap XML
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Homepage -->
  <url>
    <loc>${siteConfig.url}/</loc>
    <lastmod>${siteConfig.lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteConfig.defaultImage}</image:loc>
      <image:title>Frooxi - Leading IT Solutions</image:title>
    </image:image>
  </url>

  <!-- Dynamic routes -->
  ${routes
    .filter(route => route.url !== '/') // Skip homepage as it's already added
    .map(route => {
      return `
  <url>
    <loc>${siteConfig.url}${route.url}</loc>
    <lastmod>${siteConfig.lastMod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <image:image>
      <image:loc>${siteConfig.defaultImage}</image:loc>
      <image:title>Frooxi - ${route.url.split('/').pop().split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}</image:title>
    </image:image>
  </url>`;
    })
    .join('\n')}
</urlset>`;

  // Generate sitemap index if you have multiple sitemaps
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteConfig.url}/sitemap.xml</loc>
    <lastmod>${siteConfig.lastMod}</lastmod>
  </sitemap>
  <!-- Additional sitemaps can be added here -->
</sitemapindex>`;

  // Ensure the public directory exists
  const publicDir = resolve(process.cwd(), 'dist');
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemaps
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);
  writeFileSync(join(publicDir, 'sitemap-index.xml'), sitemapIndex);
  
  console.log('✅ Sitemaps generated successfully!');
  console.log(`🔗 Main sitemap: ${siteConfig.url}/sitemap.xml`);
  console.log(`🔗 Sitemap index: ${siteConfig.url}/sitemap-index.xml`);
};

// Generate robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /private/
Disallow: /api/
Disallow: /admin/
Disallow: /account/
Disallow: /*?*
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.json$

# Sitemaps
Sitemap: ${siteConfig.url}/sitemap.xml
Sitemap: ${siteConfig.url}/sitemap-index.xml`;

  const publicDir = resolve(process.cwd(), 'dist');
  writeFileSync(join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ robots.txt generated successfully!');
};

// Run the generators
try {
  generateSitemap();
  generateRobotsTxt();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

generateSitemap();
