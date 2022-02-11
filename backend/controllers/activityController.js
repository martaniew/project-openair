import asyncHandler from "express-async-handler";
import Activity from "../models/activityModel.js";
import getCoordsForAddress from "../utils/location.js";

// @desc    Fetch all activities
// @route   GET /api/activities
// @access  Public
const getActivities = asyncHandler(async (req, res) => {
  // defining max activities per page 
  const pageSize = 10;

  //number of page from which request was send
  const page = Number(req.query.pageNumber) || 1;

 // object with searching parameters 
  let searchedPhrases = JSON.parse(req.query.searchParams);
  console.log(searchedPhrases);

  let keywords = {};
// if request contient searched phrase we add it to object with MongoDb regular expression, i to ignore capital letters 
  if (Object.keys(searchedPhrases).length === 0) {
    keywords = {};
  } else {
    for (let key in searchedPhrases) {
      let searchedPhrase = searchedPhrases[key];
      keywords[key] = { $regex: searchedPhrase, $options: "i" };
    }
  }
  
  // number of founded documents 
  const count = await Activity.countDocuments(keywords);
  
  //Get activities number of activities according to max activity per page, skipping already downloded 
  const activities = await Activity.find(keywords)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  //sending response with activities, max activities per page, and total number of pages 
  res.json({ activities, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single activity
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate("user");

  if (activity) {
    res.json(activity);
  } else {
    res.status(404);
    throw new Error("Activity not found");
  }
});

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (activity) {
    await activity.remove();
    res.json({ message: "Activity removed" });
  } else {
    res.status(404);
    throw new Error("Activity not found");
  }
});

// @desc    Create an activity
// @route   POST /api/activities
// @access  Private
const createActivity = asyncHandler(async (req, res) => {
  console.log(req);
  const { discipline, adress, image, description, difficulty, contact } =
    req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(adress);
  } catch (error) {
    res.status(400);
    throw new Error("Impossible to find coordinates for this adress");
  }

  console.log(coordinates);

  const activity = new Activity({
    user: req.user._id,
    discipline: discipline,
    adress: adress,
    image: image,
    description: description,
    difficulty: difficulty,
    contact: contact,
    location: coordinates,
  });

  const createdActivity = await activity.save();
  res.status(201).json(createdActivity);
});

// @desc    Update an activity
// @route   PUT /api/activities/:id
// @access  Private/
const updateActivity = asyncHandler(async (req, res) => {
  const { discipline, adress, image, description, difficulty, contact } =
    req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(adress);
  } catch (error) {
    res.status(400);
    throw new Error("Impossible to find coordinates for this adress");
  }

  console.log(coordinates);

  const activity = await Activity.findById(req.params.id);

  console.log(activity);

  if (activity) {
    activity.discipline = discipline;
    activity.adress = adress;
    activity.description = description;
    activity.image = image;
    activity.description = description;
    activity.difficulty = difficulty;
    activity.contact = contact;
    activity.location = coordinates;

    const updatedActivity = await activity.save();
    res.json(updatedActivity);
    console.log(updatedActivity);
  } else {
    res.status(404);
    throw new Error("Activity not found");
  }
});

// @desc    Create new review
// @route   POST /api/activities/:id/reviews
// @access  Private
const createActivityReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const activity = await Activity.findById(req.params.id);

  if (activity) {
    const alreadyReviewed = activity.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Activity already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    activity.reviews.push(review);

    activity.numReviews = activity.reviews.length;

    activity.rating =
      activity.reviews.reduce((acc, item) => item.rating + acc, 0) /
      activity.reviews.length;

    await activity.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Activity not found");
  }
});

// @desc    Get top rated activities
// @route   GET /api/activities/top
// @access  Public
const getTopActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({}).sort({ rating: -1 }).limit(3);

  res.json(activities);
});

// @desc    Get logged in user activities
// @route   GET /api/activities/myactivities
// @access  Private
const getMyActivities = asyncHandler(async (req, res) => {
  console.log("kuku");
  const activities = await Activity.find({ user: req.params.id });
  console.log(activities);

  console.log(req.params.id);
  res.json(activities);
});

export {
  getActivities,
  getActivityById,
  deleteActivity,
  createActivity,
  updateActivity,
  createActivityReview,
  getTopActivities,
  getMyActivities,
};
