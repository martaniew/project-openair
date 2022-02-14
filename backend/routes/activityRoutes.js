import express from "express";
const router = express.Router();
import {
  getActivities,
  getActivityById,
  deleteActivity,
  createActivity,
  updateActivity,
  createActivityReview,
  getTopActivities,
  getMyActivities,
} from "../controllers/activityController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getActivities).post(protect, createActivity);

router.route("/:id/reviews").post(protect, createActivityReview);

router.route("/top").get(getTopActivities);

router.route("/:id/myactivities").get(protect, getMyActivities);

router
  .route("/:id")
  .get(getActivityById)
  .delete(protect, deleteActivity)
  .put(protect, updateActivity);

export default router;
