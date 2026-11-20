import { client } from "../config/redis";
import { db } from "../prisma/db";
import { getPropertyImageUrls, replacePropertyImageUrls } from "./propertyImages.service";

type UpdateListingData = {
    hostId?: string;
    name?: string;
    location?: string;
    pricePerDay?: number;
    maxGuests?: number;
    imageUrls?: string[];
};

export async function updateListing(id: string, listingData: UpdateListingData) {
    if (listingData.imageUrls !== undefined) {
        if (
            listingData.imageUrls.length < 1 ||
            listingData.imageUrls.length > 10 ||
            listingData.imageUrls.some((url) => {
                try {
                    return new URL(url).protocol !== "https:";
                } catch {
                    return true;
                }
            })
        ) {
            throw new Error("Provide between 1 and 10 valid HTTPS image URLs");
        }
    }

    const existingListing = await db.orm.public.Properties.first({ id });
    if (!existingListing) throw new Error("No listing found for the given ID");

    const { imageUrls, pricePerDay, ...propertyData } = listingData;
    const propertyUpdate = {
        ...propertyData,
        ...(pricePerDay !== undefined
            ? { pricePerDay: String(pricePerDay) }
            : {}),
    };

    if (Object.keys(propertyUpdate).length > 0) {
        await db.orm.public.Properties
            .where({ id })
            .update(propertyUpdate);
    }

    if (imageUrls !== undefined) {
        await replacePropertyImageUrls(id, imageUrls);
    }

    const updatedListing = await db.orm.public.Properties.first({ id });
    if (!updatedListing) throw new Error("No listing found for the given ID");

    await client.del(id);
    await client.del(existingListing.hostId);
    await client.del(existingListing.location);
    if (updatedListing.location !== existingListing.location) {
        await client.del(updatedListing.location);
    }

    return {
        ...updatedListing,
        pricePerDay: Number(updatedListing.pricePerDay),
        imageUrls: await getPropertyImageUrls(id),
    };
};