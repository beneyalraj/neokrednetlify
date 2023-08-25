const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "5min",
        }
      );

      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 5 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      fullname,
      email,
      dateofbirth,
      password,
      confirmPassword,
      phonenumber,
      address,
      securityquestion,
      city,
      state,
      country,
      zipcode,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !dateofbirth ||
      !password ||
      !confirmPassword ||
      !phonenumber ||
      !address ||
      !securityquestion ||
      !city ||
      !state ||
      !country ||
      !zipcode
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword does not match, please try again",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      dateofbirth,
      password: hashedPassword,
      phonenumber,
      address,
      securityquestion,
      city,
      state,
      country,
      zipcode,
    });

    return res.status(200).json({
      success: true,
      message: "registation Successfull",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registrered. Please try again",
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const id = req.params.id;
    //console.log(id);
    const userDetails = await User.findById(id).exec();
    // console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

