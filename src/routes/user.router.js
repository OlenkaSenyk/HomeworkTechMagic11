import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUserById,
  deleteUserById,
  getUserByIdWithArticles,
} from "../controllers/user.controller.js";
import { checkUserExists } from "../middlewares/user.middleware.js";

const userRouter = Router();

userRouter
  .get("/", getUsers)
  .get("/:id", checkUserExists, getUserByIdWithArticles)
  .post("/", createUser)
  .put("/:id", checkUserExists, updateUserById)
  .delete("/:id", checkUserExists, deleteUserById);

export default userRouter;
