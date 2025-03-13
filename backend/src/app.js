const express = require("express");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const app = express();


app.use(express.json());
app.use("/auth",authRoute);
app.get("/",(req,res)=>{
    res.send("welcome to job portal");
})
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


module.exports = app;
