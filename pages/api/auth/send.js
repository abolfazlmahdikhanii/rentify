import { success, z } from "zod";
import { authSchema } from "@/validations/auth";
import connectToDB from "@/configs/db";

import { sendMail } from "@/service/mail-service";
import { generateOTP } from "@/lib/auth";
import UserOtps from "@/models/UserOtps";

const saveOtp = async (email, otp) => {
  const expireTime = new Date(Date.now() + 2 * 60 * 1000);

  const userOtp = await UserOtps.findOne({ email });

  let blockedUntil = null;

  if (userOtp && userOtp.attempts === 3) {
    blockedUntil = new Date(Date.now() + 1 * 60 * 1000);
  }

  await UserOtps.findOneAndDelete({ email });

  const newOtp = await UserOtps.create({
    email,
    otp,
    expireTime,
    attempts: userOtp ? Number(userOtp.attempts) + 1 : 1,
    blockedUntil: blockedUntil || null,
  });

  return !!newOtp;
};

const handler = async (req, res) => {
  if (req.method !== "POST") return;
  await connectToDB();
  try {
    const { email } = req.body;

    const validEmail = authSchema.parse({ email: `${email}` });
    // Clean up all expired OTPs for this email
    await UserOtps.deleteMany({
      expireTime: { $lt: new Date() }, // Delete all expired OTPs
    });
    // check if block send otp and time passed unblock
    const existing = await UserOtps.findOne({ email: validEmail.email });
    if (existing && existing.blockedUntil !== null) {
      if (new Date(existing.blockedUntil) > new Date()) {
        return res.status(429).json({
          message: "Maximum attempts reached. Sending disabled for 2 minutes.",
        });
      } else if (new Date(existing.blockedUntil) <= new Date()) {
        await UserOtps.findOneAndUpdate(
          { email: validEmail.email },
          {
            attempts: 0,
            blockedUntil: null,
          },
        );
      }
    }
    const otp = generateOTP();

    const saved = await saveOtp(validEmail.email, otp);

    if (!saved) {
      return res.status(400).json({
        message: "generate new otp has problem!",
      });
    }

    const newMail = await sendMail({
      to: validEmail.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    });

      //  const newMail = {success:false}
    const showDevOtp = process.env.NEXT_PUBLIC_SHOW_DEV_OTP === "true";

    if (!newMail.success) {
      return res.status(500).json({
        success: false,
        message:
          "Email delivery is temporarily unstable due to current Vercel SMTP limitations.",

        ...(showDevOtp && {
          devOtp: otp,
        }),
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
