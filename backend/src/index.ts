import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import analyzeRouter from "./routes/analyze";
import catalogRouter from "./routes/catalog";
import containersRouter from "./routes/containers";
import correctionsRouter from "./routes/corrections";
import { errorHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import historyRouter from "./routes/history";
import statsRouter from "./routes/stats";
import tipsRouter from "./routes/tips";
import { ValidationError } from "./utils/errors";
import wasteRouter from "./routes/waste";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === "production";
const developmentOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
];
const allowedOrigins = new Set(
  isProduction
    ? [process.env.FRONTEND_URL].filter(
        (origin): origin is string => typeof origin === "string" && origin.length > 0,
      )
    : developmentOrigins,
);

const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Příliš mnoho požadavků, zkuste to prosím později.",
  },
});

const analyzeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Limit pro analýzu byl překročen. Zkuste to prosím později.",
  },
});

app.use(helmet());
app.use(globalRateLimit);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new ValidationError("Origin není povolený v CORS"));
    },
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/health", healthRouter);
app.use("/api/tips", tipsRouter);
app.use("/api/analyze", analyzeRateLimit, analyzeRouter);
app.use("/api/waste", wasteRouter);
app.use("/api/history", historyRouter);
app.use("/api/corrections", correctionsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/containers", containersRouter);
app.use("/api/catalog", catalogRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} nebyla nalezena`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
});
