import React from 'react';

export default function HotelSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': 'https://www.romeehotel.com',
    name: 'Romee Hotel',
    description: 'Modern ve konforlu odalarımız, harika galerilerimiz ve blog içeriklerimizle size en iyi konaklama deneyimini sunuyoruz.',
    url: 'https://www.romeehotel.com',
    telephone: '+90-212-XXX-XX-XX',
    email: 'info@romeehotel.com',
    image: 'https://www.romeehotel.com/og-image.jpg',
    priceRange: '$$',
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Örnek Mahallesi, Romee Sokak No: 123',
      addressLocality: 'Beyoğlu',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.0339',
      longitude: '28.9796',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/romeehotel',
      'https://www.instagram.com/romeehotel',
      'https://www.twitter.com/romeehotel',
    ],
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Free WiFi',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: '24-hour front desk',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Room service',
        value: true,
      },
    ],
    checkinTime: '14:00',
    checkoutTime: '12:00',
    numberOfRooms: 50,
    petsAllowed: false,
    smokingAllowed: false,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
