import express from "express";
import helmet from "helmet";
import compression from "compression";
import { createServer } from "http";
import cors from "cors";
import requestIp from "request-ip";
import { rateLimit } from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import morganMiddleware from "./logger/morgan.logger.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();

const httpServer = createServer(app);

// global middlewares
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production.
    credentials: true,
  })
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.limit
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(compression());
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(morganMiddleware);

//health check
app.get("/", (req, res) => {
  res.send("i'm  alive");
});
app.use("/api/v1/", routes);
app.use(errorHandler);

export { httpServer };
