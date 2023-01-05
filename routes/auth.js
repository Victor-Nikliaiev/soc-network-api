import express from "express";
import { User } from "../models/User.js";
export const router = express.Router();
import bcrypt from "bcrypt";

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });

        // save user and response.
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user &&
            res
                .status(404)
                .send(`The user with '${req.body.email}' was not found`);
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !isPasswordValid &&
            res.status(400).send("Provided password is incorrect.");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});
