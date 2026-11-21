import bcrypt from 'bcryptjs';
import { parse } from 'dotenv';

const demoPassword = 'DemoStay!2026';
const host = {
  id: '0dad83f7-dded-41a3-bb98-5580d40ad671',
  email: 'host@stay-demo.example',
  name: 'Aarav Mehta',
};
const guest = {
  id: '4a33ebcd-ace8-4756-920c-d40d5a8d7de6',
  email: 'guest@stay-demo.example',
  name: 'Mira Shah',
};

const photos = {
  palmVilla: '1582268611958-ebfd161ef9cf',
  resortPool: '1520250497591-112f2f40a3f4',
  courtyard: '1571896349842-33c89424de2d',
  gardenHouse: '1568605114967-8130f3a36994',
  hotelGarden: '1566073771259-6a8506099945',
  modernVilla: '1613490493576-7fde63acd811',
  poolVilla: '1564013799919-ab600027ffc6',
  cabin: '1510798831971-661eb04b3739',
  woodHouse: '1449158743715-0a90ebb6d2d8',
  cityLounge: '1560448204-e02f11c3d0e2',
  loft: '1522708323590-d24dbb6b0267',
  lounge: '1600210492486-724fe5c67fb0',
  sittingRoom: '1600607687939-ce8a6c25118c',
  bathroom: '1600607687920-4e2a09cf159d',
  bedroom: '1616594039964-ae9021a400a0',
  readingRoom: '1618221195710-dd6b41faaea6',
  terraceHouse: '1600585154340-be6161a56a0c',
  patioHouse: '1512917774080-9991f1c4c750',
};

const galleryPhotos = {
  villa: [photos.lounge, photos.bedroom, photos.bathroom, photos.terraceHouse],
  heritage: [photos.readingRoom, photos.bedroom, photos.sittingRoom, photos.patioHouse],
  cabin: [photos.sittingRoom, photos.bedroom, photos.readingRoom, photos.terraceHouse],
  apartment: [photos.lounge, photos.bedroom, photos.bathroom, photos.readingRoom],
  resort: [photos.patioHouse, photos.sittingRoom, photos.bedroom, photos.bathroom],
};

function gallery(cover: keyof typeof photos, style: keyof typeof galleryPhotos) {
  return [photos[cover], ...galleryPhotos[style]].map(
    (photo) => `https://images.unsplash.com/photo-${photo}?w=800&q=80`,
  );
}

const listings = [
  {
    id: '10453180-22a4-42d2-ab68-dce13366a0aa',
    name: 'Palm Grove Pool Villa',
    location: 'Goa',
    pricePerDay: 6500,
    maxGuests: 6,
    imageUrls: gallery('palmVilla', 'villa'),
  },
  {
    id: '34ad5326-b7cc-4ab4-9099-d686e6cf57cd',
    name: 'Seabreeze Courtyard Retreat',
    location: 'Goa',
    pricePerDay: 4200,
    maxGuests: 3,
    imageUrls: gallery('resortPool', 'resort'),
  },
  {
    id: '96ba3489-18c3-4bf4-b0e1-826b3416d85d',
    name: 'Pink City Terrace Suite',
    location: 'Jaipur',
    pricePerDay: 3400,
    maxGuests: 2,
    imageUrls: gallery('courtyard', 'heritage'),
  },
  {
    id: 'c1d70fa9-4d06-469c-bd73-2a8ccd52b6da',
    name: 'Pine Ridge Mountain House',
    location: 'Manali',
    pricePerDay: 4800,
    maxGuests: 4,
    imageUrls: gallery('gardenHouse', 'cabin'),
  },
  {
    id: '593640d2-1d57-4704-89c0-2d00a71dff83',
    name: 'Coconut Lane Beach Villa',
    location: 'Goa',
    pricePerDay: 5800,
    maxGuests: 5,
    imageUrls: gallery('poolVilla', 'villa'),
  },
  {
    id: '9c497c6e-5e75-4551-9f0d-ac156d05f105',
    name: 'Amber Gate Courtyard Stay',
    location: 'Jaipur',
    pricePerDay: 3900,
    maxGuests: 4,
    imageUrls: gallery('courtyard', 'heritage'),
  },
  {
    id: '936f8b7a-6299-45bf-a7ba-8a01822995e6',
    name: 'Cedar Bend Cabin',
    location: 'Manali',
    pricePerDay: 4700,
    maxGuests: 4,
    imageUrls: gallery('cabin', 'cabin'),
  },
  {
    id: '81a5072d-38e9-4ee2-af41-178fc8516c6b',
    name: 'Backwater Garden Retreat',
    location: 'Kerala',
    pricePerDay: 5200,
    maxGuests: 4,
    imageUrls: gallery('resortPool', 'resort'),
  },
  {
    id: '59dd5250-123d-4bf9-8741-6e49084b30f2',
    name: 'Cardamom Hills Bungalow',
    location: 'Kerala',
    pricePerDay: 4200,
    maxGuests: 4,
    imageUrls: gallery('gardenHouse', 'cabin'),
  },
  {
    id: 'bf6d8522-5aab-47be-a521-f98737d79e76',
    name: 'Taj East Gate Guesthouse',
    location: 'Agra',
    pricePerDay: 2900,
    maxGuests: 3,
    imageUrls: gallery('hotelGarden', 'heritage'),
  },
  {
    id: 'e16c4fa8-5c51-4cef-bc35-e120b432c567',
    name: 'Assi Ghat Courtyard Rooms',
    location: 'Varanasi',
    pricePerDay: 2800,
    maxGuests: 3,
    imageUrls: gallery('courtyard', 'heritage'),
  },
  {
    id: '9baed49c-e08d-4ac0-b746-2f3a9fa2aa1d',
    name: 'Banaras Riverside Suite',
    location: 'Varanasi',
    pricePerDay: 3600,
    maxGuests: 2,
    imageUrls: gallery('cityLounge', 'apartment'),
  },
  {
    id: 'ba89ee23-15d3-474d-b373-fbebdd597eca',
    name: 'Lake Pichola Terrace Stay',
    location: 'Udaipur',
    pricePerDay: 4600,
    maxGuests: 4,
    imageUrls: gallery('resortPool', 'heritage'),
  },
  {
    id: 'b9eabdd2-548a-4798-ba48-f03277a79691',
    name: 'Aravalli Pool Villa',
    location: 'Udaipur',
    pricePerDay: 6800,
    maxGuests: 6,
    imageUrls: gallery('modernVilla', 'villa'),
  },
  {
    id: 'aff0a83c-520e-4d45-8d6b-1f4e0728a72f',
    name: 'Pinecrest Ridge Cottage',
    location: 'Shimla',
    pricePerDay: 4300,
    maxGuests: 4,
    imageUrls: gallery('woodHouse', 'cabin'),
  },
  {
    id: '69e40679-5668-4412-9a36-fb71e9c6d789',
    name: 'Summer Hill Hideaway',
    location: 'Shimla',
    pricePerDay: 3800,
    maxGuests: 3,
    imageUrls: gallery('cabin', 'cabin'),
  },
  {
    id: '480845a2-b2fc-42a9-bf68-03f7dd3d0bfd',
    name: 'Ganga Bend Retreat',
    location: 'Rishikesh',
    pricePerDay: 3900,
    maxGuests: 4,
    imageUrls: gallery('hotelGarden', 'resort'),
  },
  {
    id: '7e21e6c1-2920-408c-b145-7bfd4b4a6255',
    name: 'Stok Valley Guesthouse',
    location: 'Ladakh',
    pricePerDay: 4800,
    maxGuests: 4,
    imageUrls: gallery('gardenHouse', 'cabin'),
  },
  {
    id: '12acf810-88ca-4956-b080-26b3798b9807',
    name: 'Leh Old Town Suite',
    location: 'Ladakh',
    pricePerDay: 3400,
    maxGuests: 2,
    imageUrls: gallery('courtyard', 'heritage'),
  },
  {
    id: '54740b65-84a4-45d4-acc6-51723a4fe042',
    name: 'Bandra Harbour Loft',
    location: 'Mumbai',
    pricePerDay: 6700,
    maxGuests: 4,
    imageUrls: gallery('cityLounge', 'apartment'),
  },
  {
    id: '2b540d01-a941-4c8e-b746-77615fee4799',
    name: 'Colaba Balcony Studio',
    location: 'Mumbai',
    pricePerDay: 5100,
    maxGuests: 2,
    imageUrls: gallery('loft', 'apartment'),
  },
  {
    id: '0bff9903-b2ca-44f9-a125-3ecad80df591',
    name: 'Nilgiri Tea Garden Cottage',
    location: 'Ooty',
    pricePerDay: 4500,
    maxGuests: 4,
    imageUrls: gallery('woodHouse', 'cabin'),
  },
  {
    id: '8a94a356-5e43-4553-8a04-f7a40b4588e6',
    name: 'Singalila View Homestay',
    location: 'Darjeeling',
    pricePerDay: 4000,
    maxGuests: 4,
    imageUrls: gallery('gardenHouse', 'cabin'),
  },
  {
    id: 'ab4241aa-9df0-4fd2-a3c3-41f9f8e60156',
    name: 'Chowrasta Heritage Suite',
    location: 'Darjeeling',
    pricePerDay: 3600,
    maxGuests: 2,
    imageUrls: gallery('hotelGarden', 'heritage'),
  },
];

async function readDatabaseUrl(service: 'auth-service' | 'catalog-service') {
  const envFile = Bun.file(new URL(`../${service}/.env`, import.meta.url));
  const databaseUrl = parse(await envFile.text()).DATABASE_URL;
  if (!databaseUrl || !/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
    throw new Error(`Set a PostgreSQL DATABASE_URL in backend/${service}/.env`);
  }
  return databaseUrl;
}

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function runSql(databaseUrl: string, sql: string) {
  const connection = new URL(databaseUrl);
  const password = connection.searchParams.get('password')
    ?? (connection.password ? decodeURIComponent(connection.password) : Bun.env.PGPASSWORD);
  connection.password = '';
  connection.searchParams.delete('password');

  const command = Bun.spawn(
    ['psql', '-X', '--no-password', '-v', 'ON_ERROR_STOP=1', '--dbname', connection.href],
    {
      env: { ...Bun.env, PGPASSWORD: password },
      stdin: new Blob([`SET standard_conforming_strings = on;\n${sql}`]),
      stdout: 'ignore',
      stderr: 'inherit',
    },
  );
  if (await command.exited !== 0) {
    throw new Error('psql failed. Check the connection and make sure the Prisma schema is applied.');
  }
}

async function seedDemo() {
  if (!Bun.which('psql')) {
    throw new Error('Install the PostgreSQL client and add psql to your PATH.');
  }
  const [authUrl, catalogUrl, hostHash, guestHash] = await Promise.all([
    readDatabaseUrl('auth-service'),
    readDatabaseUrl('catalog-service'),
    bcrypt.hash(demoPassword, 10),
    bcrypt.hash(demoPassword, 10),
  ]);
  await runSql(catalogUrl, `
    SELECT "id" FROM public."Properties" LIMIT 0;
    SELECT "id" FROM public."PropertyImageUrl" LIMIT 0;
  `);

  await runSql(authUrl, `
    INSERT INTO public."User" ("id", "email", "name", "passwordHash")
    VALUES (${[host.id, host.email, host.name, hostHash].map(sqlString).join(', ')}),
           (${[guest.id, guest.email, guest.name, guestHash].map(sqlString).join(', ')})
    ON CONFLICT ("id") DO NOTHING;
  `);

  const listingRows = listings.map(({ id, name, location, pricePerDay, maxGuests }) =>
    `(${[id, host.id, name, location].map(sqlString).join(', ')}, ${pricePerDay}, ${maxGuests})`,
  );
  const imageRows = listings.flatMap(({ id, imageUrls }) =>
    imageUrls.map((url, displayOrder) => {
      // The original seed used the listing ID for the cover photo.
      const imageId = displayOrder === 0 ? id : `${id}-photo-${displayOrder + 1}`;
      return `(${[imageId, id, url].map(sqlString).join(', ')}, ${displayOrder})`;
    }),
  );
  await runSql(catalogUrl, `
    BEGIN;
    INSERT INTO public."Properties" ("id", "hostId", "name", "location", "pricePerDay", "maxGuests")
    VALUES ${listingRows.join(',\n')}
    ON CONFLICT ("id") DO NOTHING;

    INSERT INTO public."PropertyImageUrl" ("id", "propertyId", "url", "displayOrder")
    VALUES ${imageRows.join(',\n')}
    ON CONFLICT ("id") DO NOTHING;
    COMMIT;
  `);

  console.log(`Seeded ${listings.length} demo listings and two demo accounts.`);
  console.log(`Host login: ${host.email}`);
  console.log(`Guest login: ${guest.email}`);
  console.log(`Initial password for both: ${demoPassword}`);
  const locations = [...new Set(listings.map((listing) => listing.location))];
  console.log(`To refresh existing Redis cache entries: redis-cli DEL ${host.id} ${locations.join(' ')}`);
}

await seedDemo();
