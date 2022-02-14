import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

let user = {};

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  // checking if there is token
  if (!token) {
    res.status(401);
    throw new Error("Login first to access this resource.");
  }
  // verification token and checking if user with id sent with token exist
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
