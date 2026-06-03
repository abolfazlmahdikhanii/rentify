import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";

import Property from "@/models/Property";
import PropertyDetail from "@/models/PropertyDetail";
import PropertyEquipment from "@/models/PropertyEquipment";
import PropertyImage from "@/models/PropertyImage";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyView from "@/models/PropertyView";
import PropertyLocationService from "@/service/locationService";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  await connectToDB();

  const { id } = req.query;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid property ID",
    });
  }
  if (req.method === "GET") {
    try {
      await PropertyView.create({
        propertyId: id,

        ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,

        userAgent: req.headers["user-agent"],
      });

      const property = await Property.findById(id)
        .populate("owner", "-password")

        .populate("details")
        .populate("location")
        .populate({
          path: "equipment",
          populate: {
            path: "equipment",
          },
        })
        .populate("images")
        .lean();

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      return res.status(200).json({
        success: true,
        property,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  if (req.method === "PUT") {
    try {
      const user = await userVerify(req, res);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const property = await Property.findById(id);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (property.ownerId.toString() !== user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const body = req.body;

      // Property
      await Property.findByIdAndUpdate(id, {
        title: body.title,
        propertyType: body.propertyType,
        listingType: body.listingType,
        price: body.salePrice,
        rentPrice: body.ejare_price,
        mortgagePrice: body.rahnPrice,
        status: "pending",
      });

      // Detail
      await PropertyDetail.findOneAndUpdate(
        { propertyId: id },
        {
          buildingArea: body.building_area,
          bedrooms: body.bedrooms,
          floor: body.floor_number,
          totalFloors: body.floors,
          houseYear: body.house_year,
          unitType: body.unitType,
          position: body.position,
          unitPerFloor: body.unitPerFloor,
          description: body.description,
        },
        { new: true },
      );

      // Location
      const locationPayload = {
        city: body.city,
        address: body.address,
        district: body.street,
        mainArea: body.mainArea,
        latitude: body.latitude,
        longitude: body.longitude,
      };

      if (body.latitude && body.longitude) {
        try {
          const locationData =
            await PropertyLocationService.getPropertyLocationData(
              body.latitude,
              body.longitude,
            );

          locationPayload.nearby = locationData;
        } catch (err) {
          console.log(err);
        }
      }

      await PropertyLocation.findOneAndUpdate(
        { propertyId: id },
        locationPayload,
        { new: true },
      );

      // Equipment
      await PropertyEquipment.deleteMany({
        propertyId: id,
      });

      if (Array.isArray(body.equipment) && body.equipment.length > 0) {
        await PropertyEquipment.insertMany(
          body.equipment.map((equipmentId) => ({
            propertyId: id,
            equipmentId,
          })),
        );
      }

      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  if (req.method === "DELETE") {
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const property = await Property.findById(id).populate("owner", "_id");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      property.owner._id.toString() !== user._id.toString() ||
      user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Property.deleteOne({
      _id: id,
    });

    await PropertyDetail.deleteMany({
      propertyId: id,
    });

    await PropertyLocation.deleteMany({
      propertyId: id,
    });

    await PropertyEquipment.deleteMany({
      propertyId: id,
    });
    const imageId = await PropertyImage.find({ propertyId: id }, "_id");
    const res = await fetch(`/api/upload/post-images?fid=${imageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await PropertyImage.deleteMany({
        propertyId: id,
      });
    }
    return res.json({
      success: true,
    });
  }
  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
