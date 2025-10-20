import React from 'react';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  url: string;
}

export default function BlogPostSchema({
  title,
  description,
  image,
  author,
  publishedAt,
  updatedAt,
  url,
}: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kemer Residence',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.kemerresidence.com/logo.svg',
      },
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
