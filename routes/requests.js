const express = require("express");
const router = express.Router();
const {
  createRentalRequest,
  getRentalRequests,
  getRentalRequestByUserId,
  updateRentalRequest,
  updateRentaltaltenant,
  deleteRentalRequest,
} = require("../controllers/rentalController");
const { protect } = require("../middlewares/authMiddleware");

// Renter can initiate a rental request for a specific house
router.post("/rent", protect, createRentalRequest);

// Landlord/Broker can view details of rental requests for their houses
router.get("/:houseId", getRentalRequests);
router.get("/user/:userId", getRentalRequestByUserId);

// Landlord/Broker can manage rental requests: approve, reject, propose alternative dates

router.patch("/:rentalRequestId", protect, updateRentalRequest);
router.patch("/tenant/:rentalRequestId", protect, updateRentaltaltenant);
router.delete("/:rentalRequestId", deleteRentalRequest);

module.exports = router;
