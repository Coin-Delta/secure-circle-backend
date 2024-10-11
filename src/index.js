import serverConfig from "./config/server.config.js";
import { httpServer } from "./server.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 20;

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.log("⚙️  Server is running on port: " + serverConfig.PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    startServer();
    connectDB();
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      console.log("Mongo db connect error: ", err);
    });
}
