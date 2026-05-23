import { Request, Response } from "express";
import { authService } from "../services/users";

const AuthService = new authService();

/**
 * ================= REGISTER USER =================
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await AuthService.register(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error: any) {

        // If email already exists or validation error
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= LOGIN USER =================
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        const result = await AuthService.login(email, password);

        res.status(200).json({
            success: true,
            token: result.token,
            role: result.role, 
            userId: result.UserId
        });

    } catch (error: any) {

        res.status(401).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= GET USER BY ID =================
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
            return;
        }

        const user = await AuthService.getUserById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await AuthService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
            return;
        }

        await AuthService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};