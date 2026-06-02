import refreshTokenModel from "@/models/RefreshToken";
import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Delete refresh token from database
      await refreshTokenModel.deleteOne({ token: refreshToken });
    }
    res
      .setHeader("Set-Cookie", [
        serialize("token", "", {
          path: "/",
          maxAge: 0,
        }),
        serialize("refreshToken", "", {
          httpOnly: true,
          path: "/",
          maxAge: 0,
        }),
      ])
      .status(200)
      .json({ message: "user successfully signout" });
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
export default handler;
