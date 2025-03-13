const Job = require("../models/job"); // Assuming you have a Job model

// 📝 Post a Job (Only for Recruiters)
module.exports.postJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;

        if (!req.user || req.user.role !== "recruiter") {
            return res.status(403).json({ message: "Access denied. Only recruiters can post jobs." });
        }

        const newJob = new Job({
            recruiter: req.user.id,
            title,
            description,
            company,
            location,
            salary,
            status: "ongoing" // Default status
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully", job: newJob });

    } catch (error) {
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 📄 Get All Jobs
module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json({ jobs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// ❌ Delete a Job (Only by the recruiter who posted it)
module.exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this job" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

// ✅ Update Job Status (Only for Recruiters)
module.exports.updateJobStatus = async (req, res) => {
    try {
        const jobId = req.params.jobId.trim(); // Trim extra spaces or newlines
        const { status } = req.body;

        if (!["ongoing", "ended"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job status updated successfully", job });
    } catch (error) {
        console.error("Error updating job status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

