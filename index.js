import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import { router as userRoute } from "./routes/users.js";
import { router as authRoute } from "./routes/auth.js";
import { router as postRoute } from "./routes/posts.js";

const app = express();
const port = process.env.PORT || 8880;

dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Connected to MongoDB [OK]");
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
    res.json({ title: "Social Network API", version: "1.0" });
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}!`);
});
