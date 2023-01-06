import express from "express";
export const router = express.Router();
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

// UPDATE USER
router.put("/:id", async (req, res) => {
    const requestedId = req.params.id;
    const currentUserId = req.body.userId;

    if (currentUserId !== requestedId && !!!req.body.isAdmin) {
        return res.status(403).json("You can update only your account");
    }

    if (req.body.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
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
});

// DELETE USER
router.delete("/:id", async (req, res) => {
    const requestedId = req.params.id;
    const currentUserId = req.body.userId;

    if (currentUserId !== requestedId && !!!req.body.isAdmin) {
        return res.status(403).json("You can delete only your account");
    }

    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json("Account has been deleted successfully");
    } catch (err) {
        return res.status(500).json(err);
    }
});

// GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// FOLLOW AN USER
router.put("/:id/follow", async (req, res) => {
    const currentUserID = req.body.userId;
    const followingID = req.params.id;

    if (currentUserID === followingID) {
        return res.status(403).json("you can't follow yourself");
    }

    try {
        const currentUser = await User.findById(currentUserID);
        const userToFollow = await User.findById(followingID);

        if (userToFollow.followers.includes(currentUserID)) {
            return res.status(403).json("You already follow this user");
        }

        await userToFollow.updateOne({ $push: { followers: currentUserID } });
        await currentUser.updateOne({ $push: { followings: followingID } });
        res.status(200).json("User has been followed");
    } catch (err) {
        res.status(500).json(err);
    }
});

// UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
    const currentUserID = req.body.userId;
    const unfollowingID = req.params.id;

    if (currentUserID === unfollowingID) {
        return res.status(403).json("you can't unfollow yourself");
    }

    try {
        const currentUser = await User.findById(currentUserID);
        const userToUnfollow = await User.findById(unfollowingID);

        if (!userToUnfollow.followers.includes(currentUserID)) {
            return res.status(403).json("You already don't follow this user");
        }

        await userToUnfollow.updateOne({ $pull: { followers: currentUserID } });
        await currentUser.updateOne({ $pull: { followings: unfollowingID } });
        res.status(200).json("User has been unfollowed");
    } catch (err) {
        res.status(500).json(err);
    }
});
