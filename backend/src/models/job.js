const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming you have a User model
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["ongoing", "ended"],
            default: "ongoing",
        },
    },
    { timestamps: true } 
);

module.exports = mongoose.model("Job", jobSchema);
