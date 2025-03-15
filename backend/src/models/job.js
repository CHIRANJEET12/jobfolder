const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    resumeUrl: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Applied", "Shortlisted", "Interview Scheduled", "Rejected", "Selected"], 
        default: "Applied"
    },
    interviewMessage: { type: String }, 
    interviewDate: { type: Date }, 
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

const jobSchema = new mongoose.Schema({
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    status: { type: String, enum: ["ongoing", "ended"], default: "ongoing" },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }], // ✅ Reference applications
    numApplicants: { type: Number, default: 0 }
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job, JobApplication };
