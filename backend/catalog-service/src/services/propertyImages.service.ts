import { db } from "../prisma/db";

export async function getPropertyImageUrls(propertyId: string): Promise<string[]> {
  const images = await db.orm.public.PropertyImageUrl
    .where({ propertyId })
    .all();

  return images
    .sort((first, second) => first.displayOrder - second.displayOrder)
    .map((image) => image.url);
}

export async function replacePropertyImageUrls(
  propertyId: string,
  imageUrls: string[],
): Promise<void> {
  await db.orm.public.PropertyImageUrl
    .where({ propertyId })
    .delete();

  await Promise.all(
    imageUrls.map((url, displayOrder) =>
      db.orm.public.PropertyImageUrl.create({
        propertyId,
        url,
        displayOrder,
      }),
    ),
  );
}
