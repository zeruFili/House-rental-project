const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMyProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getMyProfile);

module.exports = router;
