import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import { route as userRoute } from "./routes/users.js";
import { route as authRoute } from "./routes/auth.js";

const app = express();
const port = 8880;

dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Connected to MongoDB");
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Welcome to Homepage :D");
});

app.get("/users", (req, res) => {
    res.send("Welcome to Users!");
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}!`);
});
