import express from "express";
import path from "path";
import { connectDB } from "./config/database.ts";
import "dotenv/config";
import type { Request, Response } from "express";
import cors from "cors";

// importing middleware
import { loggerMiddleware } from "./middleware/logger.ts";

// routers
import batchRouter from "./routes/batch.routes.ts";
import studentRouter from "./routes/student.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import { authMiddleware } from "./middleware/auth.middleware.ts";

// constants
const app = express();
const PORT = 5000;
const dir = path.resolve();

// connecting to database
connectDB();

// middleware
app.use(loggerMiddleware);
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN, // react app
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
    maxAge: 86400
}));

// routing
app.get("/", authMiddleware, (req: Request, res: Response) => {
    // res.status(200).json({ message: "protected" })
    return res.json("Hello this is a protected route!")
});

// utilizing router
app.use("/auth", authRouter);
app.use("/api/batches", batchRouter);
app.use("/api/students", studentRouter);


// listening on a port
app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port http://localhost:${PORT}`);
});


// GET /api/batches ->  all
// POST /api/batches ->  create
// GET /api/batches/:batchId ->  get batchId
// PATCH /api/batches/:batchId ->  edit
// DELETE /api/batches/:batchId ->  DELETE