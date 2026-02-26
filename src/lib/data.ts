/** Cities and properties - will be migrated to Wix CMS */
export const CITIES = [
  { id: "uae", name: "UAE", slug: "uae", flag: "🇦🇪", country: "United Arab Emirates", description: "Dubai, Abu Dhabi – where ambition meets opulence" },
  { id: "uk", name: "UK", slug: "uk", flag: "🇬🇧", country: "United Kingdom", description: "London, Manchester – heritage meets innovation" },
  { id: "saudi", name: "Saudi Arabia", slug: "saudi-arabia", flag: "🇸🇦", country: "Saudi Arabia", description: "Vision 2030 – tomorrow's luxury today" },
  { id: "oman", name: "Oman", slug: "oman", flag: "🇴🇲", country: "Oman", description: "Muscat, AIDA – 130m above the sea, pure serenity" },
  { id: "qatar", name: "Qatar", slug: "qatar", flag: "🇶🇦", country: "Qatar", description: "Doha – the pearl of the Gulf" },
  { id: "spain", name: "Spain", slug: "spain", flag: "🇪🇸", country: "Spain", description: "Marbella, Costa del Sol – Mediterranean elegance" },
  { id: "maldives", name: "Maldives", slug: "maldives", flag: "🇲🇻", country: "Maldives", description: "Overwater villas – paradise redefined" },
] as const;

export type CityId = (typeof CITIES)[number]["id"];

export interface Property {
  id: string;
  cityId: CityId;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  currency: string;
  priceLabel?: string; // e.g. "from"
  type: "villa" | "apartment" | "penthouse" | "land" | "fractional";
  beds: number;
  baths: number;
  sqm?: number;
  imageUrl: string;
  gallery?: string[];
  description: string;
  highlights: string[];
  estimatedYield?: number; // annual %
  completionYear?: number;
  brandPartner?: string; // e.g. "Lamborghini", "Missoni"
  isFractional: boolean;
  fractionalSlots?: number;
  fractionalPricePerSlot?: number;
}

/** Placeholder luxury images - replace with actual assets later */
const IMG = {
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85",
  apartment: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
  land: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=85",
  oman: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85",
  marbella: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85",
  maldives: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=85",
};

export const PROPERTIES: Property[] = [
  {
    id: "aida-oman",
    cityId: "oman",
    name: "AIDA",
    slug: "aida",
    tagline: "Exclusive gated community 130m above Muscat",
    price: 850000,
    currency: "USD",
    priceLabel: "from",
    type: "villa",
    beds: 4,
    baths: 4,
    sqm: 350,
    imageUrl: IMG.oman,
    gallery: [IMG.oman, IMG.villa, IMG.land],
    description: "A magnificent gated community and golfing destination overlooking the world. Curvaceous valleys, sharp cliffs, endless shorelines – where coastal lifestyle meets nature’s tranquility.",
    highlights: ["130m above sea level", "Golf course", "Panoramic sea views", "World-class amenities"],
    estimatedYield: 6,
    completionYear: 2026,
    isFractional: true,
    fractionalSlots: 10,
    fractionalPricePerSlot: 85000,
  },
  {
    id: "tierra-viva-marbella",
    cityId: "spain",
    name: "Tierra Viva",
    slug: "tierra-viva",
    tagline: "Design Inspired by Automobili Lamborghini",
    price: 2500000,
    currency: "EUR",
    priceLabel: "from",
    type: "villa",
    beds: 5,
    baths: 5,
    sqm: 450,
    imageUrl: IMG.marbella,
    gallery: [IMG.marbella, IMG.villa],
    description: "53 bespoke villas – architectural brilliance meets automotive passion. Floor-to-ceiling windows, private infinity pools, Lamborghini-inspired design.",
    highlights: ["Lamborghini design", "Infinity pools", "Private clubhouse", "Mediterranean views"],
    estimatedYield: 5.5,
    brandPartner: "Lamborghini",
    isFractional: false,
  },
  {
    id: "marea-missoni",
    cityId: "spain",
    name: "Marea Interiors by Missoni",
    slug: "marea-missoni",
    tagline: "Bold patterns & sophisticated living at Finca Cortesin",
    price: 1200000,
    currency: "EUR",
    priceLabel: "from",
    type: "apartment",
    beds: 3,
    baths: 3,
    sqm: 180,
    imageUrl: IMG.apartment,
    gallery: [IMG.apartment, IMG.marbella],
    description: "2–4 bedroom residences at Finca Cortesin. Missoni textiles, bold geometry, private beach club, world-class spa.",
    highlights: ["Missoni interiors", "Beach club", "Golf access", "Spa"],
    estimatedYield: 5,
    brandPartner: "Missoni",
    isFractional: true,
    fractionalSlots: 8,
    fractionalPricePerSlot: 150000,
  },
  {
    id: "dubai-towers",
    cityId: "uae",
    name: "Marina Heights",
    slug: "marina-heights",
    tagline: "Skyline living in the heart of Dubai",
    price: 1850000,
    currency: "USD",
    priceLabel: "from",
    type: "penthouse",
    beds: 4,
    baths: 4,
    sqm: 320,
    imageUrl: IMG.dubai,
    gallery: [IMG.dubai, IMG.apartment],
    description: "Iconic marina views, premium finishes, concierge service. Invest where the world converges.",
    highlights: ["Marina views", "Concierge", "Pool deck", "Smart home"],
    estimatedYield: 6.5,
    isFractional: false,
  },
  {
    id: "maldives-retreat",
    cityId: "maldives",
    name: "Coral Haven",
    slug: "coral-haven",
    tagline: "Overwater paradise",
    price: 2200000,
    currency: "USD",
    priceLabel: "from",
    type: "villa",
    beds: 3,
    baths: 4,
    sqm: 280,
    imageUrl: IMG.maldives,
    gallery: [IMG.maldives, IMG.villa],
    description: "Private overwater villas with direct ocean access. Your slice of paradise with rental yield potential.",
    highlights: ["Overwater villa", "Direct ocean access", "Spa", "Diving"],
    estimatedYield: 7,
    isFractional: true,
    fractionalSlots: 12,
    fractionalPricePerSlot: 183000,
  },
  {
    id: "oman-land",
    cityId: "oman",
    name: "Hilltop Reserve",
    slug: "hilltop-reserve",
    tagline: "Prime development land with panoramic views",
    price: 450000,
    currency: "USD",
    type: "land",
    beds: 0,
    baths: 0,
    sqm: 1200,
    imageUrl: IMG.land,
    gallery: [IMG.land, IMG.oman],
    description: "Luxury terrain for custom build. Development potential with stunning sea and mountain vistas.",
    highlights: ["Development land", "Panoramic views", "Gated community", "Infrastructure ready"],
    isFractional: false,
  },
];

export function getCityBySlug(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

export function getCityById(id: CityId) {
  return CITIES.find((c) => c.id === id);
}

export function getPropertiesByCity(cityId: CityId) {
  return PROPERTIES.filter((p) => p.cityId === cityId);
}

export function getCityStats(cityId: CityId) {
  const props = getPropertiesByCity(cityId);
  const propertyCount = props.length;
  const portfolioValue = props.reduce((sum, p) => sum + p.price, 0);
  const yields = props.filter((p) => p.estimatedYield != null).map((p) => p.estimatedYield!);
  const avgYield = yields.length > 0 ? yields.reduce((a, b) => a + b, 0) / yields.length : 0;
  return { propertyCount, portfolioValue, avgYield };
}

export function getPropertyBySlug(slug: string) {
  return PROPERTIES.find((p) => p.slug === slug);
}
