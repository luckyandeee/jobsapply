const jobs = [
  {
    id: 1,
    jobcategory: "Tech",
    jobdesignation: "MERN Stack developer",
    joblocation: "Hyderabad",
    companyname: "Gowri Tech",
    salary: "1250000",
    applyby: "12/09/2024",
    skillsrequired: ["MONGO", "EXPRESS", "REACT", "NODE"],
    numberofopenings: "5",
    applicants: [],
    postedBy: 'john@Mail.com'
  },
];

export default class JobModels {
  constructor(
    id,
    jobcategory,
    jobdesignation,
    joblocation,
    companyname,
    salary,
    applyby,
    skillsrequired,
    numberofopenings,
    applicants,
    postedBy
  ) {
    this.id = id;
    this.jobcategory = jobcategory;
    this.jobdesignation = jobdesignation;
    this.joblocation = joblocation;
    this.companyname = companyname;
    this.salary = salary;
    this.applyby = applyby;
    this.skillsrequired = skillsrequired;
    this.numberofopenings = numberofopenings;
    this.applicants = applicants || [];
    this.postedBy = postedBy
  };

  static getAllJobs() {
    return jobs;
  };

  static getJobById(id) {
    return jobs.find((job) => job.id === parseInt(id));
  };

  static getApplicantsByJobId(Id) {
    const job = jobs.find((job) => job.id === parseInt(Id));
    return job ? job.applicants : [];
  };

  static createJob(data) {
    const newJob = new JobModels(
      jobs.length + 1,
      data.jobcategory,
      data.jobdesignation,
      data.joblocation,
      data.companyname,
      data.salary,
      data.applyby,
      data.skillsrequired,
      data.numberofopenings,
      data.applicant,
      data.postedBy
    );
    jobs.push(newJob);
    return newJob;
  };

  static applyforjob(data) {
    const job = this.getJobById(data.jobid);
    const applicant = {
      id: job.applicants.length + 1,
      name: data.name,
      email: data.email,
      contact: data.contact,
      resumepath: data.resumePath,
    };
    job.applicants.push(applicant);
  };
  static deleteajob(id) {
    const index = jobs.findIndex((job) => job.id === parseInt(id));

    if (index != -1) {
      // Optionally, handle the associated applicants here
      const removedJob = jobs.splice(index, 1)[0];
      return { success: true, job: removedJob };
    }

    return { success: false, message: "Job not found" };
};
static updateJob(jobId, updatedData) {
  // Find the index of the job with the given ID
  const jobIndex = jobs.findIndex((job) => job.id == parseInt(jobId));

  // Check if the job was found
  if (jobIndex == -1) {
    return { success: false, message: "Job not found" };
  }

  // Update the job details
  const jobToUpdate = jobs[jobIndex];
  
  jobToUpdate.jobcategory = updatedData.jobcategory || jobToUpdate.jobcategory;
  jobToUpdate.jobdesignation = updatedData.jobdesignation || jobToUpdate.jobdesignation;
  jobToUpdate.joblocation = updatedData.joblocation || jobToUpdate.joblocation;
  jobToUpdate.companyname = updatedData.companyname || jobToUpdate.companyname;
  jobToUpdate.salary = updatedData.salary || jobToUpdate.salary;
  jobToUpdate.applyby = updatedData.applyby || jobToUpdate.applyby;
  jobToUpdate.skillsrequired = updatedData.skillsrequired || jobToUpdate.skillsrequired;
  jobToUpdate.numberofopenings = updatedData.numberofopenings || jobToUpdate.numberofopenings;
  jobToUpdate.postedBy = updatedData.postedBy || jobToUpdate.postedBy;

  return { success: true, job: jobToUpdate };
};
}
