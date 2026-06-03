import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB");
      return;
    }

    // Use environment variable instead of localhost
    const mongoUri = process.env.rentify_MONGODB_URI;

    if (!mongoUri) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);

    console.log("Connection Successfully :)");
  } catch (error) {
    console.log("Connection Has Problem!!", error.message);
    throw error; // Re-throw to handle in calling code
  }
};

export default connectToDB;