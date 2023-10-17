const db = require("../../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



exports.login = async (req, res, next) => {
  try {
    req
      .checkBody(
        "password",
        "Password must contain at least one uppercase letter, one lowercase letter, one number ,one special character, and must be at least 8 characters long"
      ).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/
      );
    req.checkBody("email", "Please enter a valid Email address").isEmail();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).send({
        message: "Missing fields or invalid data",
        errors,
      });
    }

    const { email, password } = req.body;
    const resultedUser = await User.findOne({ where: { email } });

    if (!resultedUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, resultedUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // __ create access token with 60 min expires timer __ //
    const accessToken = jwt.sign(
      { userId: resultedUser.id, email: resultedUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );
    res.json({accessToken});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
