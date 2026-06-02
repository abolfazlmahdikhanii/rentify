import { clsx } from "clsx";
import { differenceInDays } from "date-fns/differenceInDays";
import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { sign, verify } from "jsonwebtoken";
import { capitalize } from "lodash";

const crypto = require("crypto");


export const generateOTP = () => {
  return crypto.randomInt(1000, 9999);
};

export const generateToken = (data) => {
  const token = sign({ ...data }, process.env.PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};
export const generateRefreshToken = (payload) => {
 const token = sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
export const verifyToken = (token) => {
  try {
    const isValid = verify(token, process.env.PRIVATE_KEY);
    return isValid;
  } catch (error) {
    return false;
  }
};
export const verifyRefreshToken = (token) => {
  try {
    const isValid = verify(token, process.env.REFRESH_TOKEN_SECRET);
    return isValid;
  } catch (error) {
    return false;
  }
};
export const splitMail = (mail, type = "username") => {
  const splited = mail.split("@");
  const newMail = splited[0];
  if (type === "name") {
    return capitalize(newMail);
  } else {
    return newMail;
  }
};


