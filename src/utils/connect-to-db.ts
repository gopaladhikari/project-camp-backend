import mongoose from "mongoose";

const mongodbUri = process.env["MONGODB_URI"];
console.log("mongodbUri", mongodbUri);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${mongodbUri}/project-camp`);
    console.log(conn.connection.host);
  } catch (error) {
    throw error;
  }
};
