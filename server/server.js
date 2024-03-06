const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://iot:iot123@cluster0.lpntjrk.mongodb.net/myDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Define schemas and models for table1 and attendance
const table1Schema = new mongoose.Schema({
  name: String,
  roll: String,
  branch: String,
  year: String,
  section: String,
  image: String // Add a field for storing image paths
});

const Table1 = mongoose.model("Table1", table1Schema);

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded images
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  }
});

const upload = multer({ storage: storage });

// API endpoint to insert data into table1 with image upload
app.post("/api/table1", upload.single('image'), async (req, res) => {
  try {
    const { name, roll, branch, year, section } = req.body;
    const imagePath = req.file.path; // Get the path of the uploaded image
    const newData = { name, roll, branch, year, section, image: imagePath };
    const createdData = await Table1.create(newData);
    res.status(201).json(createdData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to fetch data from table1
app.get("/api/table1", async (req, res) => {
  try {
    const data = await Table1.find().exec();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Define schema and model for attendance
const attendanceSchema = new mongoose.Schema({
  name: String,
  time: String,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// API endpoint to fetch data from attendance
app.get("/api/attendance", async (req, res) => {
  try {
    const data = await Attendance.find().exec();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware function to automatically add timestamp to attendance data in 12-hour format
const addTimestamp = (req, res, next) => {
  const currentDate = new Date();
  const timestamp = currentDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  req.body.time = timestamp; // Add current timestamp in 12-hour format
  next();
};

const addTimestampToAttendance = async (req, res, next) => {
  try {
    const newData = req.body;
    // Check if newData with the same name already exists in the database
    const existingData = await Attendance.find({ name: newData.name });

    if (existingData.length >= 2) {
      // If duplicates exceed the limit, delete the second and third duplicates
      await Attendance.deleteMany({ name: newData.name });
    }

    next(); // Continue to the next middleware
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Your route handler
app.post(
  "/api/attendance",
  addTimestampToAttendance,
  addTimestamp,
  async (req, res) => {
    try {
      const newData = req.body;
      const createdData = await Attendance.create(newData);
      res.status(201).json(createdData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to delete entry from Table 1
app.delete("/api/table1/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Table1.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted from Table 1" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting entry from Table 1" });
  }
});

// Route to delete entry from Attendance
app.delete("/api/attendance/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Attendance.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted from Attendance" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting entry from Attendance" });
  }
});

// Schema for table 3
const table3Schema = new mongoose.Schema({
  name: String,
  roll: String,
  time: String,
});
const Table3 = mongoose.model("Table3", table3Schema);

// Schema for table 4
const table4Schema = new mongoose.Schema({
  name: String,
  roll: String,
  time: String,
});
const Table4 = mongoose.model("Table4", table4Schema);

// Route to handle POST requests for table 3
app.post("/api/table3", addTimestampToAttendance, async (req, res) => {
  try {
    const { name, roll, time } = req.body; // Extracting name, roll, and time from the request body
    const newData = { name, roll, time }; // Creating a new object with name, roll, and time
    const createdData = await Table3.create(newData);
    res.status(201).json(createdData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle POST requests for table 4
app.post("/api/table4", addTimestampToAttendance, async (req, res) => {
  try {
    const { name, roll, time } = req.body; // Extracting name, roll, and time from the request body
    const newData = { name, roll, time }; // Creating a new object with name, roll, and time
    const createdData = await Table4.create(newData);
    res.status(201).json(createdData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for deleting duplicates
app.post("/api/deleteDuplicates", async (req, res) => {
  const { name } = req.body;

  try {
    // Find all entries with the provided name
    const duplicates = await Attendance.find({ name });

    if (duplicates.length > 1) {
      // Keep the first entry and delete the rest
      await Attendance.deleteMany({ name, _id: { $ne: duplicates[0]._id } });
      res.status(200).json({ message: "Duplicates deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "No duplicates found for the given name" });
    }
  } catch (error) {
    console.error("Error deleting duplicates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API endpoint to fetch data from table3
app.get("/api/table3", async (req, res) => {
  try {
    const data = await Table3.find().exec();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to fetch data from table4
app.get("/api/table4", async (req, res) => {
  try {
    const data = await Table4.find().exec();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete entry from Table3
app.delete("/api/table3/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Table3.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted from Table3" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting entry from Table3" });
  }
});

// Route to delete entry from Table4
app.delete("/api/table4/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Table4.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted from Table4" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting entry from Table4" });
  }
});

app.delete("/api/table4", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }

  // Filter out the entry with the specified name
  table4Data = table4Data.filter((entry) => entry.name !== name);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
