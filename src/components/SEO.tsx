import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'Frooxi, IT Services, Web Development, App Development, SEO, UI/UX Design, Cyber Security, Software Development',
  image = '/og-image.jpg',
  type = 'website',
  author = 'Frooxi',
  publishedTime,
  modifiedTime,
  section = 'Technology',
  tags = [],
}) => {
  const { pathname } = useLocation();
  const siteUrl = 'https://frooxi.com';
  const fullTitle = `${title} | Frooxi - IT Solutions & Services`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = `${siteUrl}${pathname}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: fullTitle,
    description,
    url: canonicalUrl,
    ...(type === 'article' && {
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: {
        '@type': 'Organization',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Frooxi',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      articleSection: section,
      keywords: tags.join(', '),
    }),
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Frooxi',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/frooxihq',
      'https://linkedin.com/company/frooxi',
      'https://facebook.com/frooxihq',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        availableLanguage: 'English',
      },
    ],
  };

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:site_name" content="Frooxi" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImageUrl} />
        <meta name="twitter:creator" content="@frooxihq" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="content-language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;
