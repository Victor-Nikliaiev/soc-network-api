import express from "express";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
export const router = express.Router();

// CREATE A POST
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE A POST
router.put("/:id", async (req, res) => {
    const currentUserId = req.body.userId;
    const postId = req.params.id;

    try {
        const targetPost = await Post.findById(postId);

        if (targetPost.userId !== currentUserId && !!!req.body.isAdmin) {
            return res.status(403).json("You can update only your post.");
        }

        const { userId, ...others } = req.body;
        await targetPost.updateOne({ $set: others });
        res.status(200).json("The post has been updated.");
    } catch (err) {
        res.send(500).json(err);
    }
});

// DELETE A POST
router.delete("/:id", async (req, res) => {
    const currentUserId = req.body.userId;
    const postId = req.params.id;

    try {
        const targetPost = await Post.findById(postId);

        if (targetPost.userId !== currentUserId && !!!req.body.isAdmin) {
            return res.status(403).json("You can delete only your posts.");
        }

        await targetPost.deleteOne();
        res.status(200).json("The post has been deleted.");
    } catch (err) {
        res.send(500).json(err);
    }
});

// LIKE A POST
router.put("/:id/like", async (req, res) => {
    const postId = req.params.id;
    const currentUserId = req.body.userId;
    try {
        const post = await Post.findByIdAndUpdate(postId);

        if (post.likes.includes(currentUserId)) {
            await post.updateOne({ $pull: { likes: currentUserId } });
            return res.status(200).json("The post has been disliked.");
        }

        await post.updateOne({ $push: { likes: currentUserId } });
        res.status(200).json("The post has been liked.");
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET A POST
router.get("/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET TIMELINE POSTS
router.get("/timeline/all", async (req, res) => {
    const userId = req.body.userId;

    try {
        const currentUser = await User.findById(userId);
        const currentUserPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );

        res.status(200).json(currentUserPosts.concat(...friendsPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});
