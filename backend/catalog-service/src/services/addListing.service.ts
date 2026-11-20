import { client } from "../config/redis";
import { db } from "../prisma/db";
import type { Property } from "../schemas/property.schema";
import { replacePropertyImageUrls } from "./propertyImages.service";

export async function addListing(listingData: Property) {
  const { imageUrls, ...propertyData } = listingData;

  const property = await db.orm.public.Properties.create({
    ...propertyData,
    pricePerDay: String(propertyData.pricePerDay),
  });

  if (!property) {
    throw new Error("Failed to add the listing");
  }

  await replacePropertyImageUrls(property.id, imageUrls);

  await client.del(propertyData.hostId);
  await client.del(propertyData.location);

  return {
    ...property,
    imageUrls,
  };
}
