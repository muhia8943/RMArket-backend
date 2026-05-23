import { Request, Response } from "express";
import { ItemsService } from "../services/items";

const itemsService = new ItemsService();

/**
 * ================= CREATE ITEM =================
 */
export const createItem = async (req: Request, res: Response): Promise<void> => {
    try {
        await itemsService.createItem(req.body);

        res.status(201).json({
            success: true,
            message: "Item created successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= GET ALL ITEMS =================
 */
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await itemsService.getAllItems();

        res.status(200).json({
            success: true,
            data: items
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= GET ITEM BY ID =================
 */
export const getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
            return;
        }

        const item = await itemsService.getItemById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Item not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: item
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= UPDATE ITEM =================
 */
export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
            return;
        }

        await itemsService.updateItem(id, req.body);

        res.status(200).json({
            success: true,
            message: "Item updated successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/**
 * ================= DELETE ITEM =================
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
            return;
        }

        await itemsService.deleteItem(id);

        res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};