import { readFile } from "fs/promises";
import path from "path";

import connectToDB from "@/configs/db";

import State from "@/models/State";
import City from "@/models/City";

export default async function handler(req, res) {
  try {
    await connectToDB();

    const raw = await readFile(
      path.join(process.cwd(), "public", "locations.json"),
    );

    const data = JSON.parse(raw.toString("utf8").replace(/^\uFEFF/, ""));
    if (
      !data ||
      !Array.isArray(data.States) ||
      !Array.isArray(data.Provinces) ||
      !Array.isArray(data.Cities)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid locations.json format",
      });
    }

    await State.deleteMany({});
    await City.deleteMany({});

    const stateMap = {};

    for (const state of data.States) {
      const created = await State.create({
        sourceId: state.Id,
        title: state.Title,
      });

      stateMap[state.Id] = created._id;
    }

    const provinceMap = {};

    for (const province of data.Provinces) {
      provinceMap[province.Id] = province.StateId;
    }

    const cities = [];

    for (const city of data.Cities) {
      const stateSourceId = provinceMap[city.ProvinceId];

      if (!stateMap[stateSourceId]) continue;

      cities.push({
        sourceId: city.Id,
        stateId: stateMap[stateSourceId],
        title: city.Title,
      });
    }

    await City.insertMany(cities);

    return res.status(200).json({
      success: true,
      states: await State.countDocuments(),
      cities: await City.countDocuments(),
    });
  } catch (error) {
    console.error("/api/admin/import-location error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to import locations",
    });
  }
}
