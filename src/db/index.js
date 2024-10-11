import mongoose from "mongoose";
import serverConfig from "../config/server.config.js";
/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${serverConfig.MONGO_URI}`
    );
    dbInstance = connectionInstance;
    console.log(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
