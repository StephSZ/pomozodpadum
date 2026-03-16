import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import analyzeRouter from "./routes/analyze";
import containersRouter from "./routes/containers";
import correctionsRouter from "./routes/corrections";
import { errorHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import historyRouter from "./routes/history";
import statsRouter from "./routes/stats";
import tipsRouter from "./routes/tips";
import wasteRouter from "./routes/waste";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = new Set(["http://localhost:5173", "http://localhost:8080"]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/health", healthRouter);
app.use("/api/tips", tipsRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/waste", wasteRouter);
app.use("/api/history", historyRouter);
app.use("/api/corrections", correctionsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/containers", containersRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
