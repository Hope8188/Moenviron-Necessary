import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  keywords?: string;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
  product?: {
    name: string;
    description: string;
    price: number;
    currency: string;
    image?: string;
    sku?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    brand?: string;
    category?: string;
    ratingValue?: number;
    reviewCount?: number;
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
}

const SITE_NAME = "Moenviron";
const SITE_URL = "https://moenviron.com";
const DEFAULT_OG_IMAGE =
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/2274ce5a-a92d-4b73-b73e-99562f585de3/moenviron-logo-resized-1768037588209.webp?width=1200&height=630&resize=contain";

const defaultMeta = {
  title: `${SITE_NAME} - Sustainable Fashion from Recycled Textiles`,
  description:
    "Pioneering the circular economy through sustainable fashion. Ethical UK collection, advanced Kenya processing, and measurable global impact.",
  image: DEFAULT_OG_IMAGE,
  url: SITE_URL,
};

export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  keywords,
  breadcrumbs,
  noindex = false,
  product,
  article,
}: SEOProps) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : defaultMeta.title;
  const pageDescription = description || defaultMeta.description;
  const pageImage = image || defaultMeta.image;
  const pageUrl = url || defaultMeta.url;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
      width: 400,
      height: 200,
    },
    description: defaultMeta.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44 7394 382060",
      contactType: "customer service",
      email: "info@moenviron.com",
      areaServed: ["GB", "KE", "UG", "TZ", "RW", "NG", "ZA", "GH", "ET"],
      availableLanguage: ["English", "Swahili"],
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Wiltshire",
      postalCode: "SP11 9GP",
      addressCountry: "GB",
    },
    sameAs: [
      "https://www.linkedin.com/in/moses-onyuro-98336837b/",
      "https://www.instagram.com/moenviron/",
      "https://www.tiktok.com/@moenviron",
    ],
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 10 },
    slogan: "Circular Fashion · UK to Kenya",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image || pageImage,
        sku: product.sku || product.name.toLowerCase().replace(/\s+/g, "-"),
        brand: { "@type": "Brand", name: product.brand || SITE_NAME },
        category: product.category,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency,
          availability: `https://schema.org/${product.availability || "InStock"}`,
          url: pageUrl,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          seller: { "@type": "Organization", name: SITE_NAME },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: "5", currency: "GBP" },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: ["GB", "KE", "US"],
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 10, unitCode: "DAY" },
            },
          },
        },
        manufacturer: {
          "@type": "Organization",
          name: SITE_NAME,
          address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
        },
        ...(product.ratingValue && product.reviewCount
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.ratingValue,
                reviewCount: product.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
        additionalProperty: [
          { "@type": "PropertyValue", name: "Material", value: "100% Recycled UK Textiles" },
          { "@type": "PropertyValue", name: "Sustainability", value: "Circular Economy Product" },
          { "@type": "PropertyValue", name: "Made In", value: "Kenya" },
        ],
      }
    : null;

  const articleSchema =
    type === "article" && article
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pageTitle,
          description: pageDescription,
          image: pageImage,
          url: pageUrl,
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime || article.publishedTime,
          author: { "@type": "Person", name: article.author || "Moenviron Team" },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
          },
          articleSection: article.section,
        }
      : null;

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            ...breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name: crumb.name,
              item: crumb.url.startsWith("http") ? crumb.url : `${SITE_URL}${crumb.url}`,
            })),
          ],
        }
      : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />

      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type === "product" ? "product" : type === "article" ? "article" : "website"} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_KE" />
      <meta property="og:locale:alternate" content="sw_KE" />

      {type === "article" && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === "article" && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@moenviron" />
      <meta name="twitter:creator" content="@moenviron" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />

      {/* Geo targeting */}
      <meta name="geo.region" content="GB-WIL" />
      <meta name="geo.placename" content="Wiltshire, United Kingdom" />
      <meta name="geo.position" content="51.0685;-1.7940" />
      <meta name="ICBM" content="51.0685, -1.7940" />

      {/* Structured data */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}
      {articleSchema && (
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
}
