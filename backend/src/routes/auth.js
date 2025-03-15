const express = require("express");
const userController = require("../controllers/userController");
const formController = require("../controllers/formController"); 
const validateUser = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/choose-role", userController.chooserole);

router.post("/signup",userController.signin);

router.post("/login",userController.login);

router.get("/dashboard", validateUser, userController.dashboard);

router.post("/post-job", validateUser, formController.postJob);

router.get("/jobs", formController.getJobs);

router.delete("/delete-job/:id", validateUser, formController.deleteJob);

router.patch("/update-job-status/:jobId", validateUser, formController.updateJobStatus);

router.post("/apply/:jobId", validateUser, formController.applyForJob);

router.post("/update-application/:appId",validateUser,formController.updateApplicationStatus);

router.get("/my-applications",validateUser,formController.getCandidateApplications);

module.exports = router;
