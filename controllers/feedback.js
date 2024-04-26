const Feedback = require("../models/feedback");
const House = require("../models/House");
const Notification = require("../models/Notification");

// Controller to submit feedback
const RentalRequest = require("../models/houserequest");

// Controller to submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { house, rating, comment } = req.body;
    const renter = req.user.id; // Assuming the user information is stored in the req.user property by the middleware

    // Check if the renter has already submitted feedback for the house
    const existingFeedback = await Feedback.findOne({ renter, house });
    if (existingFeedback) {
      return res.status(403).json({ error: "Feedback already submitted" });
    }

    // Check if the renter has completed a rental period for the house
    const rentalRequest = await RentalRequest.findOne({
      user: renter,
      house,
      status: "rented",
    });

    if (!rentalRequest) {
      return res.status(403).json({
        error: "Rental period not completed or invalid user/house",
      });
    }

    // Create a new feedback document
    const feedback = new Feedback({
      renter,
      house,
      rating,
      comment,
    });

    // Validate the feedback input
    const validationResult = feedback.validateSync();
    if (validationResult) {
      return res.status(400).json({ error: validationResult.message });
    }

    // Save the feedback
    await feedback.save();

    // Recalculate the average rating for the house
    const houseFeedback = await Feedback.find({ house });
    const feedbackCount = houseFeedback.length;
    const totalRating = houseFeedback.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    const averageRating = totalRating / feedbackCount;

    // Update the house model with the new average rating
    await House.findByIdAndUpdate(house, { rating: averageRating });

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get feedback for a house
const getHouseFeedback = async (req, res) => {
  try {
    const { houseId } = req.params;

    // Check if the house exists
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Find all feedback for the house
    const feedback = await Feedback.find({ house: houseId }).populate(
      "renter",
      "name"
    );

    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  submitFeedback,
  getHouseFeedback,
};
