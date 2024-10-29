import { compare } from "bcrypt";
import User from "../models/Usermodel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs";
import { deleteImage } from "../cloudConfig.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send("Email or Password is missing!!!");
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send("Email or Password is missing!!!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User with the given email not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(404).send("Email or password is incorrect");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const getUserInfo = async (req, res, next) => {
  try {
    console.log("req.userId 75: ",req.userId);
    const {userId } = req;
    const userData = await User.findById(userId);
    console.log("User ID:", req.userId);
    if (!userData) {
        return res.status(404).send("User with the given email not found");
    }
    return res.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        color: userData.color,
        image: userData.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    console.log("req.userId 97 ",req.userId);
    const {userId } = req;
    const {firstName, lastName, color} = req.body;

    if (!firstName || !lastName) {
        return res.status(400).send("Firstname, Lastname and color is required !!!");
    }
    const userData = await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new: true, runValidators: true})
    return res.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        color: userData.color,
        image: userData.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("profile picture is required")
    }
    const path = req.file.path;
    const filename = req.file.filename;
    const updatedUser = await User.findByIdAndUpdate(req.userId, {image: {path,filename}}, {new:true, runValidators: true})
    return res.status(200).json({
        image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const deleteProfileImage = async (req, res, next) => {
  try {
    console.log("req.userId 137 ",req.userId);
    const {userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).send("User not found")
    }
    deleteImage(user.image.filename)
    user.image.filename = "";
    user.image.path = "";
    await user.save()
    return res.status(200).send("Profile image removed successfully")
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt","",{maxAge:1,secure: true, sameSite: "None"})
    return res.status(200).send("Logout successfull")
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};
