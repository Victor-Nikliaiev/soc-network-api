import express from "express";
import { User } from "../models/User.js";
export const route = express.Router();
import bcrypt from "bcrypt";

// REGISTER
route.post("/register", async (req, res) => {
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
    } catch (err) {
        console.log(err);
    }
});

// LOGIN
