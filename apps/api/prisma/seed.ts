import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  {
    slug: 'traditional-wear',
    name: 'Traditional Wear',
    description: 'Umushanana, imyitero, igitenge wraps, and beaded accessories for Gusaba & Gukwa',
    iconName: 'crown',
    sortOrder: 1,
  },
  {
    slug: 'modern-bridal',
    name: 'Modern Bridal',
    description: 'White gowns, veils, tiaras, and accessories for the religious & civil ceremony',
    iconName: 'flower',
    sortOrder: 2,
  },
  {
    slug: 'grooms-wear',
    name: "Groom's Wear",
    description: 'Tailored suits and traditional menswear for every ceremony',
    iconName: 'shirt',
    sortOrder: 3,
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    description: 'Shoes for the bride, groom, and the wedding party',
    iconName: 'footprints',
    sortOrder: 4,
  },
  {
    slug: 'decoration',
    name: 'Decoration',
    description: 'Imitako, floral arches, table settings, and stage drapes',
    iconName: 'sparkles',
    sortOrder: 5,
  },
  {
    slug: 'cars-transport',
    name: 'Cars & Transport',
    description: 'Bridal cars and fleets for the bridal party',
    iconName: 'car',
    sortOrder: 6,
  },
  {
    slug: 'tents-furniture',
    name: 'Tents & Furniture',
    description: 'Igisenge, chairs, tables, and stages for the reception',
    iconName: 'tent',
    sortOrder: 7,
  },
  {
    slug: 'catering',
    name: 'Catering & Food',
    description: 'Brochette, ubugali, ibitoki, urwagwa — full packages for every ceremony',
    iconName: 'utensils',
    sortOrder: 8,
  },
  {
    slug: 'cakes',
    name: 'Cakes',
    description: 'Wedding cakes and engagement cakes by talented Kigali bakers',
    iconName: 'cake',
    sortOrder: 9,
  },
  {
    slug: 'photo-video',
    name: 'Photography & Video',
    description: 'Photographers, videographers, and drone coverage for every moment',
    iconName: 'camera',
    sortOrder: 10,
  },
  {
    slug: 'music-sound',
    name: 'Music & Sound',
    description: 'DJs, ingoma drummers, and professional sound systems',
    iconName: 'music',
    sortOrder: 11,
  },
  {
    slug: 'makeup-hair',
    name: 'Makeup & Hair',
    description: 'Bridal makeup and hair styling specialists',
    iconName: 'palette',
    sortOrder: 12,
  },
];

const sampleItems: Array<{
  categorySlug: string;
  name: string;
  description: string;
  pricePerEvent: number;
  quantity: number;
  images: string[];
  isFeatured?: boolean;
}> = [
  {
    categorySlug: 'traditional-wear',
    name: 'Umushanana Royal Gold',
    description: 'A regal umushanana in cream and gold, fully beaded sash and matching head wrap.',
    pricePerEvent: 250_000,
    quantity: 1,
    images: ['/legacy-assets/umushanana-gold.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'traditional-wear',
    name: 'Umushanana Emerald',
    description: 'Deep emerald umushanana with hand-embroidered ivory accents.',
    pricePerEvent: 220_000,
    quantity: 1,
    images: ['/legacy-assets/umushanana-emerald.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'modern-bridal',
    name: 'Ivory Cathedral Gown',
    description: 'A-line gown with cathedral train, lace bodice, and detachable veil.',
    pricePerEvent: 600_000,
    quantity: 1,
    images: ['/legacy-assets/gown-cathedral.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'grooms-wear',
    name: 'Midnight Three-Piece Suit',
    description: 'Italian wool three-piece suit in midnight navy with satin lapels.',
    pricePerEvent: 180_000,
    quantity: 3,
    images: ['/legacy-assets/suit-navy.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'cars-transport',
    name: 'Mercedes S-Class Bridal Car',
    description: 'Chauffeured Mercedes S-Class with floral arrangement and ribbons.',
    pricePerEvent: 350_000,
    quantity: 1,
    images: ['/legacy-assets/car-mercedes.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'decoration',
    name: 'Imitako Reception Package',
    description: 'Full reception décor: floral arch, drapes, table centrepieces for up to 200 guests.',
    pricePerEvent: 1_200_000,
    quantity: 2,
    images: ['/legacy-assets/decor-reception.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'catering',
    name: 'Kigali Feast Buffet (200 guests)',
    description: 'Brochette, ubugali, ibitoki, sambaza, ibirayi, and dessert station.',
    pricePerEvent: 2_500_000,
    quantity: 2,
    images: ['/legacy-assets/catering-feast.jpg'],
  },
  {
    categorySlug: 'photo-video',
    name: 'Full-Day Photo + Video Coverage',
    description: 'Two photographers, one videographer, drone, edited highlight reel.',
    pricePerEvent: 800_000,
    quantity: 2,
    images: ['/legacy-assets/photo-video.jpg'],
    isFeatured: true,
  },
  {
    categorySlug: 'music-sound',
    name: 'Ingoma Drummers Ensemble',
    description: 'Traditional ingoma drummers — 6-person ensemble for ceremonies and reception.',
    pricePerEvent: 400_000,
    quantity: 2,
    images: ['/legacy-assets/decor-extra.jpg'],
  },
  {
    categorySlug: 'makeup-hair',
    name: 'Bridal Makeup + Hair Package',
    description: 'Full bridal package including trial, day-of makeup, and hair styling for bride and 2 maids.',
    pricePerEvent: 220_000,
    quantity: 3,
    images: ['/legacy-assets/photo-video.jpg'],
  },
  {
    categorySlug: 'cakes',
    name: 'Three-Tier Wedding Cake',
    description: 'Three-tier vanilla & chocolate cake with ivory fondant and gold detailing.',
    pricePerEvent: 280_000,
    quantity: 4,
    images: ['/legacy-assets/cake-three-tier.jpg'],
  },
  {
    categorySlug: 'tents-furniture',
    name: 'Reception Tent (300 guests)',
    description: 'Premium white tent with lighting, chairs, and round tables for 300 guests.',
    pricePerEvent: 900_000,
    quantity: 3,
    images: ['/legacy-assets/decor-reception.jpg'],
  },
];

async function main() {
  console.log('Seeding categories...');
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  console.log('Seeding rental items...');
  const allCategories = await prisma.category.findMany();
  const bySlug = new Map(allCategories.map((c) => [c.slug, c.id] as const));

  for (const item of sampleItems) {
    const categoryId = bySlug.get(item.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.rentalItem.findFirst({
      where: { name: item.name, categoryId },
    });
    if (existing) {
      await prisma.rentalItem.update({
        where: { id: existing.id },
        data: {
          description: item.description,
          pricePerEvent: item.pricePerEvent,
          quantity: item.quantity,
          images: item.images,
          isFeatured: item.isFeatured ?? false,
        },
      });
    } else {
      await prisma.rentalItem.create({
        data: {
          categoryId,
          name: item.name,
          description: item.description,
          pricePerEvent: item.pricePerEvent,
          quantity: item.quantity,
          images: item.images,
          isFeatured: item.isFeatured ?? false,
        },
      });
    }
  }

  console.log('Seeding admin user...');
  const adminEmail = 'admin@bridalbelle.rw';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Boutique Owner', role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Boutique Owner',
      role: 'ADMIN',
    },
  });

  console.log(`\nAdmin seeded: ${adminEmail} / ${adminPassword}`);

  // ── Gallery photos (dummy Unsplash images) ──────────────────────────────
  console.log('Seeding gallery photos...');
  const galleryPhotos = [
    {
      id: 'seed-gallery-1',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      clientName: 'Aline & Eric',
      caption: 'A magical Gusaba ceremony filled with ululation and joy.',
      eventType: 'GUSABA' as const,
      sortOrder: 1,
    },
    {
      id: 'seed-gallery-2',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      clientName: 'Claudine & Jean-Pierre',
      caption: 'Traditional umushanana in the most beautiful deep purple.',
      eventType: 'GUKWA' as const,
      sortOrder: 2,
    },
    {
      id: 'seed-gallery-3',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      clientName: 'Diane & Patrick',
      caption: 'An elegant white reception at the Kigali Convention Centre.',
      eventType: 'RECEPTION' as const,
      sortOrder: 3,
    },
    {
      id: 'seed-gallery-4',
      imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
      clientName: 'Solange & David',
      caption: 'Civil ceremony — simple, intimate, and perfect.',
      eventType: 'CIVIL' as const,
      sortOrder: 4,
    },
    {
      id: 'seed-gallery-5',
      imageUrl: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&q=80',
      clientName: 'Immaculée & Bruno',
      caption: 'The flowers and decor perfectly matched the Kinyarwanda theme.',
      eventType: 'RELIGIOUS' as const,
      sortOrder: 5,
    },
    {
      id: 'seed-gallery-6',
      imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
      clientName: 'Vestine & Alain',
      caption: 'Our traditional igitenge wrap styling on the big day.',
      eventType: 'GUSABA' as const,
      sortOrder: 6,
    },
    {
      id: 'seed-gallery-7',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80',
      clientName: 'Nadège & Samuel',
      caption: 'The bridal car decorated with fresh flowers from Kimironko Market.',
      eventType: 'RECEPTION' as const,
      sortOrder: 7,
    },
    {
      id: 'seed-gallery-8',
      imageUrl: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=800&q=80',
      clientName: 'Josiane & Frank',
      caption: 'First dance under thousands of golden fairy lights.',
      eventType: 'RECEPTION' as const,
      sortOrder: 8,
    },
  ];

  for (const photo of galleryPhotos) {
    const { id, ...data } = photo;
    await prisma.galleryPhoto.upsert({
      where: { id },
      update: data,
      create: { id, ...data, isPublished: true },
    });
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
