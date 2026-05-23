import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserById, getAllUsers,deleteUser
} from "../controller/user.controller";

const router = Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user by ID
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;