const RentalRequest = require("../models/houseRequestModel");
const House = require("../models/House");
const Notification = require("../models/notificationModel");

// Renter can initiate a rental request for a specific house
const createRentalRequest = async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ error: "you cant create a request " });
    }
    const houseId = req.body.house;
    console.log(houseId);
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    const rentalRequest = new RentalRequest({
      user: req.user.id,
      house: req.body.house,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
    });

    // Save the rental request
    await rentalRequest.save();

    const rentalRequestId = rentalRequest._id; // Get the rental request ID

    const notification = new Notification({
      user: house.user.toString(),
      request: rentalRequestId, // Assign the rental request ID to the request field
      description: req.body.description,
      house: house,
    });

    // Save the notification
    await notification.save();

    res.json({ message: "Rental request created successfully", rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Landlord/Broker receives notifications about new rental requests
// Landlord/Broker can view details of rental requests for their houses
const getRentalRequests = async (req, res) => {
  try {
    const { houseId } = req.params;

    // Find the house by ID
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Retrieve the rental requests associated with the house
    const rentalRequests = await RentalRequest.find({ house: houseId });

    res.json({ rentalRequests });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRentalRequest = async (req, res) => {
  try {
    const { rentalRequestId } = req.params;
    const userId = req.user.id;

    // Check if the rental request exists
    const rentalRequest = await RentalRequest.findById(rentalRequestId);

    if (req.user.role !== "landlord" && req.user.role !== "broker") {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (!rentalRequest) {
      return res.status(404).json({ error: "Rental request not found" });
    }

    // Find the house associated with the rental request
    const house = await House.findById(rentalRequest.house);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Check if the user is the owner of the house
    if (house.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of the house" });
    }

    // Update the rental request with the new data
    rentalRequest.status = req.body.status || rentalRequest.status;
    rentalRequest.alternativeDates =
      req.body.alternativeDates || rentalRequest.alternativeDates;

    // If the status is set to "rented", update the house availability
    if (rentalRequest.status === "rented") {
      house.availability = "rented";
    }

    // Save the updated rental request and house
    await Promise.all([rentalRequest.save(), house.save()]);

    // Create a notification
    const notification = new Notification({
      user: rentalRequest.user,
      request: rentalRequestId,
      description: req.body.description,
      house: rentalRequest.house,
    });

    await notification.save();

    res.json({ message: "Rental request updated successfully", rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// useru yelakewn requestoch lemayet

const getRentalRequestByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const rentalRequest = await RentalRequest.findOne({
      user: userId,
    }).populate("house");

    if (!rentalRequest) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    res.json(rentalRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRentaltaltenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, price, description } = req.body;

    const rentalRequest = await RentalRequest.findById(id);

    if (!rentalRequest) {
      return res.status(404).json({ error: "Rental request not found" });
    }

    // Check if the user has permission to update the rental request
    if (req.user.id !== rentalRequest.user.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Update the rental request with the provided fields
    rentalRequest.startDate = startDate;
    rentalRequest.endDate = endDate;
    rentalRequest.price = price;

    // Save the updated rental request
    await rentalRequest.save();

    // Update the associated notification
    const notification = await Notification.findOne({ request: id });

    if (notification) {
      notification.description = description;
      await notification.save();
    }

    res.json({ message: "Rental request updated successfully", rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const rentalRequest = await RentalRequest.findById(id);

    if (!rentalRequest) {
      return res.status(404).json({ error: "Rental request not found" });
    }

    // Check if the user has permission to delete the rental request
    if (req.user.id !== rentalRequest.user.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete the rental request
    await rentalRequest.remove();

    // Delete the associated notification, if exists
    await Notification.deleteOne({ request: id });

    res.json({ message: "Rental request deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRentalRequest,
  getRentalRequests,
  getRentalRequestByUserId,
  updateRentalRequest,
  updateRentaltaltenant,
  deleteRentalRequest,
};
