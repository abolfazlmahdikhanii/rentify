import Property from "@/models/Property";

import PropertyLocation from "@/models/PropertyLocation";

import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import PropertyDetail from "@/models/PropertyDetail";
import PropertyLocationService from "@/service/locationService";
import PropertyEquipment from "@/models/PropertyEquipment";
import Equipment from "@/models/Equipment";

function transliteratePersian(input) {
  if (!input) return "";
  const map = {
    آ: "a",
    ا: "a",
    ب: "b",
    پ: "p",
    ت: "t",
    ث: "s",
    ج: "j",
    چ: "ch",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "z",
    ر: "r",
    ز: "z",
    ژ: "zh",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "z",
    ط: "t",
    ظ: "z",
    ع: "",
    غ: "gh",
    ف: "f",
    ق: "gh",
    ک: "k",
    گ: "g",
    ل: "l",
    م: "m",
    ن: "n",
    و: "v",
    ه: "h",
    ی: "y",
    ي: "y",
    ء: "",
    ة: "h",
    "\u200c": "", // zero-width non-joiner
  };

  return String(input)
    .split("")
    .map((ch) => {
      if (/[\u0600-\u06FF]/.test(ch)) {
        return map[ch] !== undefined ? map[ch] : "";
      }
      return ch;
    })
    .join("");
}

function makeSlug(text) {
  const transliterated = transliteratePersian(text || "");
  const slug = String(transliterated || text || "property")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || Date.now().toString(36);
}

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
    });
  }

  try {
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    const slug = req.body.slug || makeSlug(req.body.title || "property");

    const property = await Property.create({
      ownerId: user.id,
      title: req.body.title,
      slug,
      propertyType: req.body.propertyType,
      listingType: req.body.listingType,
      price: req.body.salePrice,
      rentPrice: req.body.ejare_price,
      mortgagePrice: req.body.rahnPrice,
    });

    const equipments = await Equipment.find({
      _id: { $in: req.body.equipment || [] },
    });

    await PropertyDetail.create({
      propertyId: property._id,

      buildingArea: req.body.building_area,

      bedrooms: req.body.bedrooms,

      bathrooms: req.body.bathrooms || 1,

      floor: req.body.floor_number,

      totalFloors: req.body.floors,

      houseYear: req.body.house_year,
      unitType: req.body.unitType,
      position: req.body.position,
      unitPerFloor: req.body.unitPerFloor,
      description: req.body.description,
    });
    if (Array.isArray(req.body.equipment) && req.body.equipment.length > 0) {
      await PropertyEquipment.insertMany(
        req.body.equipment.map((equipmentId) => ({
          propertyId: property._id,
          equipmentId,
        })),
      );
    }
    const locationPayload = {
      propertyId: property._id,
      city: req.body.city,
      address: req.body.address,
      district: req.body.street,
      mainArea: req.body.mainArea,
    };
    if (req.body.latitude && req.body.longitude) {
      try {
        const locationData =
          await PropertyLocationService.getPropertyLocationData(
            req.body.latitude,
            req.body.longitude,
          );

        locationPayload.latitude = req.body.latitude;
        locationPayload.longitude = req.body.longitude;
        locationPayload.nearby = locationData.nearby;
        locationPayload.address = locationData.address.address;
        locationPayload.district = locationData.address.district;
      } catch (err) {
        locationPayload.latitude = req.body.latitude;
        locationPayload.longitude = req.body.longitude;
      }
    }
    await PropertyLocation.create(locationPayload);
    return res.status(201).json({
      success: true,
      propertyId: property._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
