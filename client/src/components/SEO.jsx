import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = 'AKCRRSA - Addis Ketema';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Addis Ketema Subcity Civil Registration and Residency Service Agency (AKCRRSA) official website. Access services, documents, news, and more.';
  const siteUrl = 'https://akcrrsa-website.vercel.app'; // Update with actual domain if different
  const defaultImage = `${siteUrl}/img/logo.png`; // Fallback image

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;
