import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';



export const getPosts = async(req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async(req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async(req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()})

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async(req, res) => {

    try {
        const { id } = req.params;
        const { title, message, creator, selectedFile, tags } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

        await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

        res.json(updatedPost);
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async(req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "Please sign up first" })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    // find wheather this post as been liked by this user

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        // user never liked
        post.likes.push(req.userId);
    } else {
        // else delete the reserved like on press again
        // or like the post
        //filter loops// return the array of all the like besides the current user like
        //remove the id in the likes array
        post.likes = post.likes.filter((id) => id !== String(req.userId));

    }


    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}