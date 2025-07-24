import mongoose from "mongoose";

if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL environment variable is not defined");
}

await mongoose.connect(process.env.MONGODB_URL);

export { mongoose };
