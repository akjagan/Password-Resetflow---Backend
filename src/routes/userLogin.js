import express from "express";
import userController from "../controllers/userLogin.js";

const routes = express.Router();

routes.post("/create", userController.createUser);
routes.get("/all", userController.getAllUsers);
routes.post("/login", userController.login);
routes.post("/forgot-password", userController.forgotPassword);
routes.post("/reset-password/:token", userController.resetPassword);

export default routes;