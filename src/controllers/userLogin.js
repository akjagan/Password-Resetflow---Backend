import userModel from "../modals/user.js";
import auth from "../common/auth.js";
import nodemailer from "nodemailer";
import "dotenv/config.js";

const createUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      req.body.password = await auth.hashPassword(req.body.password);
      await userModel.create(req.body);
      res.status(201).send({
        message: "User Created Successfully!!",
      });
    } else {
      res.status(400).send({
        message: `User with email ${req.body.email} already exists`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      message: "User Details Fetched Successfully!!",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      if (await auth.hashCompare(req.body.password, user.password)) {
        let payload = {
          name: user.name,
          email: user.email,
        };
        let token = await auth.createToken(payload);
        res.status(200).send({
          message: "Login Successful",
          token,
        });
      } else {
        res.status(400).send({
          message: "Incorrect Password",
        });
      }
    } else {
      res.status(400).send({
        message: "User does not exists",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      let payload = {
        name: user.name,
        email: user.email,
      };
      let token = await auth.createToken(payload);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

      async function main() {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Password Reset",
          text: `You requested for a password reset. Click here: https://passwd-reset7.netlify.app/user/reset-password/${token}`,
        });
        console.log("Message sent: %s", info.messageId);
      }
      await main();

      res.status(200).send({
        message: "Sent Mail with Reset Link",
        token,
      });
    } else {
      res.status(400).send({
        message: "User does not exists",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    let payload;
    if (token) {
      payload = await auth.decodeToken(token);
      if (payload.exp <= Math.floor(Date.now() / 1000)) {
        res.status(401).send({
          message: "Token Expired",
        });
      }
    }

    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(400).send({
        message: "User does not exist",
      });
    }

    const hashedPassword = await auth.hashPassword(password);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      message: "Password Reset Successful",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
      error,
    });
  }
};

export default {
  createUser,
  getAllUsers,
  login,
  forgotPassword,
  resetPassword,
};