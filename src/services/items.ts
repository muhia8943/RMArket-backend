import { poolPromise } from "../config/sql.config";
import * as sql from "mssql";
import { items } from "../interface/items.interface";

export class ItemsService {

    // ================= CREATE ITEM =================
    public async createItem(item: items): Promise<void> {
        const pool = await poolPromise;

        await pool.request()
            .input("name", sql.NVarChar, item.name)
            .input("description", sql.NVarChar, item.description)
            .input("price", sql.Decimal(10,2), item.price)
            .input("stock_quantity", sql.Int, item.stock_quantity)
            .input("category", sql.NVarChar, item.category)
            .input("image", sql.NVarChar, item.image)
            .execute("spCreateItem");
    }


    // ================= GET ALL ITEMS =================
    public async getAllItems(): Promise<items[]> {
        const pool = await poolPromise;

        const result = await pool.request()
            .execute("spGetAllItems");

        return result.recordset;
    }


    // ================= GET ITEM BY ID =================
    public async getItemById(id: number): Promise<items | null> {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("ItemID", sql.Int, id)
            .execute("spGetItemById");

        return result.recordset[0] || null;
    }


    // ================= UPDATE ITEM =================
    public async updateItem(id: number, item: Partial<items>): Promise<void> {
        const pool = await poolPromise;

        await pool.request()
            .input("ItemID", sql.Int, id)
            .input("name", sql.NVarChar, item.name)
            .input("description", sql.NVarChar, item.description)
            .input("price", sql.Decimal(10,2), item.price)
            .input("stock_quantity", sql.Int, item.stock_quantity)
            .input("category", sql.NVarChar, item.category)
            .input("image", sql.NVarChar, item.image)
            .execute("spUpdateItem");
    }


    // ================= DELETE ITEM =================
    public async deleteItem(id: number): Promise<void> {
        const pool = await poolPromise;

        await pool.request()
            .input("ItemID", sql.Int, id)
            .execute("spDeleteItem");
    }
}