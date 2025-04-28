import express from "express";
import Trade from "../models/Trade.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Importing the authMiddleware

const router = express.Router();

// POST route to add a trade
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("req.auth = ", req.auth); // Log the user information from the decoded token
    const userId = req.auth.userId; // This comes from the JWT token after the authMiddleware
    const trade = new Trade({ ...req.body, userId });
    await trade.save();
    res.status(201).json({ message: "Trade Added" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// GET route to fetch all trades for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the userId from the decoded JWT token
    const trades = await Trade.find({ userId }); // Fetch trades for the authenticated user
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
