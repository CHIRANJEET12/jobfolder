const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const authRoute = require("./routes/auth");
const cors = require("cors");


const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload()); 
app.use(cors({
  origin: "http://localhost:5174", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
  credentials: true // Allow cookies if needed
}));

app.use((req, res, next) => {
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    next();
});

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the job portal");
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

module.exports = app;
