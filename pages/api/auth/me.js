import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";

import User from "@/models/User";


const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  try {
  const user=await userVerify(req,res)
    if (!user){
  
       return res.status(404).json({ message: "User Not Found!" })
    };

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
export default handler;
