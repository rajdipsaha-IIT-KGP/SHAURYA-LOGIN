
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/user"); 

const app = express();

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json()); 

// ------------------ Routes ------------------
app.use("/user", userRouter);

// ------------------ MongoDB Connection ------------------
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://rajdipsaha7697:Rajdip%402006@rajdip.r4ziwjt.mongodb.net/shaurya"
    );
    console.log(" MongoDB connected successfully");

    // ------------------ Start Server ------------------
    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  } catch (err) {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

main();
