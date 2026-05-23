import { poolPromise } from "../config/sql.config";
import * as sql from "mssql";
import { MpesaService } from "./mpesa.service";

export class OrderService {
    private mpesaService = new MpesaService();
    /**
     * ================= ADD ITEM TO CART =================
     */
    public async addToCart(
        userId: number,
        itemId: number,
        quantity: number
    ): Promise<void> {

        const pool = await poolPromise;

        await pool.request()
            .input("UserID", sql.Int, userId)
            .input("ItemID", sql.Int, itemId)
            .input("Quantity", sql.Int, quantity)
            .execute("spAddToCart");
    }



    /**
     * ================= GET USER CART =================
     */
    public async getCart(userId: number) {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("UserID", sql.Int, userId)
            .execute("spGetCart");

        return result.recordset;
    }



    /**
     * ================= UPDATE ITEM QUANTITY IN CART =================
     */
    public async updateCartItem(
        orderId: number,
        itemId: number,
        quantity: number
    ): Promise<void> {

        const pool = await poolPromise;

        await pool.request()
            .input("OrderID", sql.Int, orderId)
            .input("ItemID", sql.Int, itemId)
            .input("Quantity", sql.Int, quantity)
            .execute("spUpdateCartItem");
    }



    /**
     * ================= REMOVE ITEM FROM CART =================
     */
    public async removeFromCart(
        orderId: number,
        itemId: number
    ): Promise<void> {

        const pool = await poolPromise;

        await pool.request()
            .input("OrderID", sql.Int, orderId)
            .input("ItemID", sql.Int, itemId)
            .execute("spRemoveFromCart");
    }



    /**
     * ================= CHECKOUT (MARK AS PAID + REDUCE STOCK) =================
     */
public async checkout(
    userId: number,
    paymentMethod: string,
    phone?: string
): Promise<any> {

    const pool = await poolPromise;

    /**
     * ================= GET CART TOTAL =================
     */
    const cart = await this.getCart(userId);

    const total = cart.reduce(
        (sum, item) => sum + item.SubTotal,
        0
    );



    /**
     * ================= MPESA PAYMENT =================
     */
    if (paymentMethod === "MPESA") {

        if (!phone) {
            throw new Error("Phone number required");
        }

        const stkResponse =
            await this.mpesaService.stkPush(
                phone,
                total
            );

        return stkResponse;
    }



    /**
     * ================= PAY ON DELIVERY =================
     */
    await pool.request()
        .input("UserID", sql.Int, userId)
        .input("PaymentMethod", sql.NVarChar, paymentMethod)
        .execute("spCheckout");

    return {
        message: "Checkout successful"
    };
}



    /**
     * ================= GET ORDER HISTORY (PAID ORDERS) =================
     */
public async getUserOrders(userId: number) {

    const pool = await poolPromise;

    const result = await pool.request()
        .input("UserID", sql.Int, userId)
        .execute("spGetUserOrders");

    return result.recordset;

}

public async getAllOrders() {

    const pool = await poolPromise;

    const result = await pool.request()
        .execute("spGetAllOrders");

    return result.recordset;

}
}