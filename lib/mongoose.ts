import mongoose from "mongoose";

let isConnect = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("Mongo DB URL Not Found!");

  if (isConnect) return console.log("Already Connected to MONGO DB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnect = true;
  } catch (error) {
    console.log(error);
  }
};
