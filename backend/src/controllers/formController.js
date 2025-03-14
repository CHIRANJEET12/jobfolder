const { Job, JobApplication } = require("../models/job");
const uploadToCloud = require("../utils/uploadToCloud");

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
            status: "ongoing", 
            applicants: [], 
            numApplicants: 0, 
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully", job: newJob });

    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// 📄 Get All Jobs
module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json({ jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

module.exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this job" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });

    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

module.exports.updateJobStatus = async (req, res) => {
    try {
        const jobId = req.params.jobId.trim();
        const { status } = req.body;

        // Validate job status
        if (!["ongoing", "ended"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value. Allowed values: 'ongoing', 'ended'." });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this job's status" });
        }

        job.status = status;
        await job.save();

        res.json({ message: "Job status updated successfully", job });
    } catch (error) {
        console.error("Error updating job status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports.applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId.trim();
        const { message } = req.body;
        const resumeFile = req.files?.resume;

        if (!req.user || req.user.role !== "candidate") {
            return res.status(403).json({ message: "Access denied. Only candidates can apply for jobs." });
        }

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.status !== "ongoing") {
            return res.status(400).json({ message: "Cannot apply for this job. It has ended." });
        }

        if (!req.files || !req.files.resume) {
            return res.status(400).json({ message: "Resume file is required." });
        }
        
        const resume = req.files.resume;
        if (resume.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are allowed." });
        }
        

        const resumeUrl = await uploadToCloud(resumeFile);

        const existingApplication = await JobApplication.findOne({ job: jobId, candidate: req.user.id });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        const application = new JobApplication({
            job: jobId,
            candidate: req.user.id,
            message: message || "No message provided",
            resumeUrl
        });

        await application.save();

        job.applicants.push(application._id);
        job.numApplicants = job.applicants.length;
        await job.save();

        res.status(200).json({ message: "Application successful", application });

    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};