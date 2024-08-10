import UserModel from "../models/user.models.js";

export default class UserController {
  postRegister(req, res) {
    if (req.errors) {
      return res.json({
        success: false,
        errorMessage: req.errors,
        userEmail: req.session.userEmail,
      });
    }

    const { email, username } = req.body;
    const existingUserByEmail = UserModel.findUserByEmail(email);
    const existingUserByUsername = UserModel.findUserByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return res.json({
        success: false,
        errorMessage: "User with this email or username already exists.",
      });
    }

    const registrationResult = UserModel.register(req.body);

    return res.json({
      success: true,
      Message: "Successfully signed up!",
      user: registrationResult.user,
    });
  }

  postLogin(req, res) {
    const loginResult = UserModel.login(req.body);

    if (!loginResult) {
      res
        .status(401)
        .json({ success: false, errorMessage: "Incorrect Details" });
    } else {
      req.session.userEmail = loginResult.email;
      return res
        .status(200)
        .json({
          success: true,
          Message: "Login successful",
          user: loginResult,
          userEmail: req.session.userEmail,
        });
    }
  }
  postLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error logging out. Please try again.");
      } else {
        res.redirect("/");
      }
    });
  }
}
