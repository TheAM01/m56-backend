import express from "express";
import path from "path";
import { connectDB } from "./config/database.ts";
import "dotenv/config";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";

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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
        cb(null, `${unique}-${path.extname(file.originalname)}`)
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024}
})


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

app.post("/upload", upload.single("data-image"), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploaded" });
    }

    res.json({
        message: "Upload successful",
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
    });
})

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


// mongod -> local version of mongodb (server)
// mongosh -> cli client to communicate with the server
// compass -> GUI client 