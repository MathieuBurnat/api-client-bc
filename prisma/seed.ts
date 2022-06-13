import prisma from '../lib/prisma';
//import { createOrder, Customer, OrderInput } from '../src/functions/index'

const load = async () => {
  try {
    const eventType = await prisma.eventType.findMany();
    if (eventType.length > 0) {
      throw new Error('EventType are already seeded');
    }

    // create eventType
    await prisma.eventType.createMany({
      data: [
        { slug: 'Warranty extented', content: 'PRODUCT_WARRANTY_EXTENTED' },
        { slug: 'Created', content: 'PRODUCT_CREATED' },
        { slug: 'Retrieved', content: 'PRODUCT_RETRIEVED' },
        { slug: 'Qrcode generated', content: 'PRODUCT_QRCODE_GENERATED' },
        { slug: 'Ready to use', content: 'READY_TO_USE' },
        { slug: 'Under repair', content: 'UNDER_REPAIR' },
        { slug: 'Dead', content: 'OUT' },
        {
          slug: 'Offers a warranty extension',
          content: 'COMMERCIAL_WARRANTY_EXTENDED',
        },
        {
          slug: 'Offers a discount coupon',
          content: 'COMMERCIAL_DISCOUNT_COUPON',
        },
      ],
    });

    console.log('✨ 8 eventyTypes successfully created!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
load();
