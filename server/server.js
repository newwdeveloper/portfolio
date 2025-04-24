import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

// (Optional) If you want to accept JSON body data
app.use(express.json());
await connectDB();

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
