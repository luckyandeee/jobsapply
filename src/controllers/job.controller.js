import sendApplicationEmail from "../middleware/nodeMailer.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Derive __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import JobModels from "../models/job.models.js";

export default class JobContoller {
  jobListPage(req, res) {
    try {
      const jobs = JobModels.getAllJobs();
      return res.render("jobListingPage", {
        showSearchBar: true,
        jobs,
        appliedMessage: false,
        userEmail:req.session.userEmail,
      });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  };
  jobDetailsPage(req, res) {
    const jobId = req.params.id;
    const job = JobModels.getJobById(jobId);
    if (job) {
      return res.render("jobDetailsPage", {
        job,
        showSearchBar: false,
        errorMessage: null,
        userEmail:req.session.userEmail,
      });
    } else {
      return res.status(404).send("Job not found");
    }
  };
  applicantListPage(req, res) {
    const jobId = req.params.id; // Extract the job ID from the request parameters
    const applicants = JobModels.getApplicantsByJobId(jobId);
    return res.render("applicantListPage", {
      showSearchBar: false,
      applicants,
      userEmail:req.session.userEmail,
    });
  };

  applicantApply(req, res) {
    if (req.errors) {
      return res.json({ success: false, errorMessage: req.errors,  userEmail:req.session.userEmail });
    } else {
       
      const resumePath = req.file.path; // Full path on the server

      // Optionally, convert to a URL path
      const publicPath = resumePath.replace(
        path.join(__dirname, "public") + path.sep,
        ""
      ); // Remove the 'public/' prefix

      // Add to req.body
      req.body.resumePath = publicPath;

      const newApply = JobModels.applyforjob(req.body);
       // Prepare applicant data for email
       const applicantData = {
        name: req.body.name,
        email: req.body.email
      };

      // Send confirmation email
      sendApplicationEmail(applicantData);
     
      return res.json({ success: true, Message: "Successfully Applied.!",  userEmail:req.session.userEmail });
    }
  };
  postNewJob(req, res) {
    return res.render("newJobPage", {
      showSearchBar: true,
      errorMessage: null,
      userEmail:req.session.userEmail
    });
  };
  postNewJobForm(req, res) {
    const newJob = JobModels.createJob(req.body);
    const jobs = JobModels.getAllJobs();
    return res.render("jobListingPage", { showSearchBar: true, jobs,  userEmail:req.session.userEmail });
  };
  deleteJob(req, res) {
    const jobId = req.params.id;
    const result = JobModels.deleteajob(jobId);

    if (result.success) {
        res.redirect('/jobs'); // Redirect to a list of jobs or another page
    } else {
        res.status(404).send(result.message); // Handle error appropriately
    }
};
postUpdateJobForm(req, res) {
  const jobId = req.params.id; // Get job ID from request parameters
  const updatedData = {
    jobcategory: req.body.jobcategory,
    jobdesignation: req.body.jobdesignation,
    joblocation: req.body.joblocation,
    companyname: req.body.companyname,
    salary: req.body.salary,
    applyby: req.body.applyby,
    skillsrequired: req.body.skillsrequired,
    numberofopenings: req.body.numberofopenings,
    postedBy: req.session.userEmail, // Or req.body.postedBy if coming from form data
  };

  const result = JobModels.updateJob(jobId, updatedData);

  if (result.success) {
    // Redirect or respond with success
    return res.redirect('/jobs'); // Redirect to the jobs list page or another relevant page
  } else {
    // Handle the error (job not found)
    return res.status(404).send(result.message);
  }
};
}
