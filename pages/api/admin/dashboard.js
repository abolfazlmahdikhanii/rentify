import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Property from "@/models/Property";
import User from "@/models/User";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method !== "GET") {
      return res.status(405).end();
    }
    const user = await userVerify(req, res);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const now = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    const [
      monthlyTrends,
      typeDistribution,

      recentProperties,
      recentUsers,
      approvedProperties,

      prevMonthRecentProperties,
      prevMonthRecentUsers,
      prevMonthApprovedProperties,

      recentHouses,
    ] = await Promise.all([
      // Monthly Trends (12 months)
      Property.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      // Property Type Distribution
      Property.aggregate([
        {
          $match: {
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$type",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Current month properties
      Property.countDocuments({
        createdAt: {
          $gte: oneMonthAgo,
        },
      }),

      // Current month users
      User.countDocuments({
        createdAt: {
          $gte: oneMonthAgo,
        },
      }),

      // Current month approved
      Property.countDocuments({
        status: "approved",
        updatedAt: {
          $gte: oneMonthAgo,
        },
      }),

      // Previous month properties
      Property.countDocuments({
        createdAt: {
          $gte: twoMonthsAgo,
          $lt: oneMonthAgo,
        },
      }),

      // Previous month users
      User.countDocuments({
        createdAt: {
          $gte: twoMonthsAgo,
          $lt: oneMonthAgo,
        },
      }),

      // Previous month approved
      Property.countDocuments({
        status: "approved",
        updatedAt: {
          $gte: twoMonthsAgo,
          $lt: oneMonthAgo,
        },
      }),

      // Last 7 properties
      Property.find()
        .populate("owner", "name lastName")
        .populate("location")
        .sort({
          createdAt: -1,
        })
        .limit(7),
    ]);

    const calculateChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Math.round(((current - previous) / previous) * 100);
    };

    const infoBoxes = [
      {
        title: "املاک ثبت شده",
        value: recentProperties,

        change: calculateChange(recentProperties, prevMonthRecentProperties),

        changeType:
          recentProperties >= prevMonthRecentProperties
            ? "increase"
            : "decrease",

        icon: "home",

        unit: "ملک",
      },

      {
        title: "کاربران جدید",
        value: recentUsers,

        change: calculateChange(recentUsers, prevMonthRecentUsers),

        changeType:
          recentUsers >= prevMonthRecentUsers ? "increase" : "decrease",

        icon: "users",

        unit: "کاربر",
      },

      {
        title: "املاک تایید شده",
        value: approvedProperties,

        change: calculateChange(
          approvedProperties,
          prevMonthApprovedProperties,
        ),

        changeType:
          approvedProperties >= prevMonthApprovedProperties
            ? "increase"
            : "decrease",

        icon: "check",

        unit: "ملک",
      },
    ];

    return res.json({
      success: true,

      data: {
        infoBoxes,

        recentHouses: recentHouses.map((property) => ({
          id: property._id,

          title: property.title,

          type: property.type,

          price: property.price,

          status: property.status,

          createdAt: property.createdAt,

          updatedAt: property.updatedAt,

          location: property.location?.city || "",

          owner: property.owner?.name || "",
        })),

        charts: [
          {
            title: "Monthly Property Creation",

            chartType: "line",

            data: {
              labels: monthlyTrends.map(
                (item) =>
                  `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
              ),

              datasets: [
                {
                  label: "Properties",

                  data: monthlyTrends.map((item) => item.count),
                },
              ],
            },
          },

          {
            title: "Property Type Distribution",

            chartType: "bar",

            data: {
              labels: typeDistribution.map((item) => item._id),

              datasets: [
                {
                  label: "Count",

                  data: typeDistribution.map((item) => item.count),
                },
              ],
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
}
