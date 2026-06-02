// pages/api/admin/import-equipment.js

import connectToDB from "@/configs/db";
import Equipment from "@/models/Equipment";

export default async function handler(req, res) {
  await connectToDB();

  await Equipment.deleteMany({});

  const equipments = [
    { title: "آسانسور", slug: "elevator" },
    { title: "پارکینگ", slug: "parking" },
    { title: "سیستم امنیتی", slug: "security" },
    { title: "سالن ورزشی", slug: "gym" },
    { title: "حیاط بزرگ", slug: "yard" },
    { title: "استخر", slug: "pool" },
    { title: "جکوزی", slug: "jacuzzi" },

    { title: "انباری", slug: "storage" },
    { title: "بالکن", slug: "balcony" },
    { title: "روف گاردن", slug: "roof-garden" },
    { title: "لابی", slug: "lobby" },
    { title: "نگهبانی", slug: "guard" },
    { title: "درب ریموت", slug: "remote-door" },
    { title: "دوربین مداربسته", slug: "cctv" },
    { title: "سونا", slug: "sauna" },
    { title: "آتش نشانی", slug: "fire-system" },
    { title: "شوتینگ زباله", slug: "garbage-chute" },
    { title: "کولر گازی", slug: "air-conditioner" },
    { title: "پکیج", slug: "package-heater" },
    { title: "شومینه", slug: "fireplace" },
  ];

  const result = await Equipment.insertMany(equipments);

  return res.status(200).json({
    success: true,
    count: result.length,
  });
}