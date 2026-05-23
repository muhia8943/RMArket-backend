import { Router } from "express";
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from "../controller/items.controller";

const router = Router();

/**
 * ================= ITEM ROUTES =================
 */

// Create item
router.post("/", createItem);

// Get all items
router.get("/", getAllItems);

// Get item by ID
router.get("/:id", getItemById);

// Update item
router.put("/:id", updateItem);

// Delete item
router.delete("/:id", deleteItem);

export default router;