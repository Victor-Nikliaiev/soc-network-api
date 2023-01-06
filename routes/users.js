import express from "express";
export const router = express.Router();
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

// UPDATE USER
router.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (req.body.userId === id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(
                    req.body.password,
                    salt
                );
                req.body.password = hashedPassword;
            } catch (err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated.");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account");
    }
});
// DELETE USER
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (req.body.userId === id || req.body.isAdmin) {
        console.log(req.user);
        try {
            const user = await User.findByIdAndDelete(id);
            res.status(200).json("Account has been deleted successfully");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account");
    }
});
// GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = user._doc;
        console.log(user._doc);
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// FOLLOW A USER
router.put("/:id", async (req, res) => {});

// UNFOLLOW A USER
