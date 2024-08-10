import { body, validationResult } from "express-validator";
import path from "path";
import JobModels from "../models/job.models.js";

export default class FormValidator {
  postNewJob = async (req, res, next) => {
    const rules = [
      body("jobcategory").notEmpty().withMessage("Job Category is Mandatory"), // option
      body("jobdesignation")
        .notEmpty()
        .withMessage("Job Designation is Mandatory"), // text
      body("joblocation").notEmpty().withMessage("Job Location is Mandatory"), // text
      body("companyname").notEmpty().withMessage("Company Name is Mandatory"), // text
      body("salary")
        .isFloat({ gt: 1 })
        .withMessage("Salary must be a number greater than 0"), // number greater than 0
      body("skillsrequired")
        .notEmpty()
        .withMessage("Skills Feild is Mandatory"), // text
      body("numberofopenings")
        .isInt({ gt: 0 })
        .withMessage("Number of openings must be a number greater than 0"), // number
      body("applyby")
        .notEmpty()
        .withMessage("Mandatory Field")
        .isDate()
        .withMessage("Invalid date format, use YYYY/MM/DD or YYYY-MM-DD")
        .custom((value) => {
          const today = new Date();
          const inputDate = new Date(value);
          if (inputDate <= today) {
            throw new Error("The job posted date must be in the future.");
          }
          return true;
        }),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    var validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.render("newJobPage", {
        errorMessage: validationErrors.array()[0].msg,
      });
    }
    next();
  };
  applicantForm = async (req, res, next) => {
    const rules = [
      body("name").notEmpty().withMessage("name is Mandatory"), // option
      body("email").isEmail().withMessage("Job Designation is Mandatory"), // text
      body("contact").isMobilePhone().withMessage("Job Location is Mandatory"), // text
      body("resume").custom((value, { req }) => {
        if (!req.file) {
          throw new Error("Resume is mandatory");
        }
        // Check if the file is a PDF
        const fileTypes = /pdf/;
        const extname = fileTypes.test(
          path.extname(req.file.originalname).toLowerCase()
        );
        if (!extname) {
          throw new Error("Only PDF files are allowed");
        }
        return true;
      }),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    var validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors
        .array()
        .map((error) => error.msg)
        .join(", ");

      req.errors = errorMessage;
    }
    next();
  };
  userRegisterForm = async (req, res, next) => {
    const rules = [
      body("username")
        .notEmpty()
        .withMessage("Username is mandatory")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long")
        .matches(/^\S+$/)
        .withMessage("Username should not contain spaces"),

      body("email")
        .notEmpty()
        .withMessage("Email is mandatory")
        .isEmail()
        .withMessage("Please enter a valid email address"),

      body("password")
        .notEmpty()
        .withMessage("Password is mandatory")
        .isLength({ min: 7 })
        .withMessage("Password must be at least 7 characters long"),
    ];
    await Promise.all(rules.map((rule) => rule.run(req)));

    var validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors
        .array()
        .map((error) => error.msg)
        .join(", ");

      req.errors = errorMessage;
    }
    next();
  };
  userLoginForm = async (req, res, next) => {
    const rules = [
      body("username")
        .notEmpty()
        .isLength({ min: 4 })
        .matches(/^\S+$/)
        .withMessage("Check Your username & password"),

      body("password")
        .notEmpty()
        .isLength({ min: 7 })
        .withMessage("Check Your username & password"),
    ];
    await Promise.all(rules.map((rule) => rule.run(req)));

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.errors = validationErrors.array()[0].msg;
    }

    next();
  };
}
