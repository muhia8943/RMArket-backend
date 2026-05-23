import { Request, Response } from "express";
import { OrderService } from "../services/oders";
import { MpesaService } from "../services/mpesa.service";

export class OrderController {
    private orderService = new OrderService();

    public addToCart = async (req: Request, res: Response) => {
        try {
            const { userId, itemId, quantity } = req.body;

            await this.orderService.addToCart(userId, itemId, quantity);

            res.status(200).json({ message: "Item added to cart" });
       } catch (error: any) {
        console.error("SQL ERROR:", error);
        res.status(500).json({ error: error.message });
    }
    };

    public getCart = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId);

            const cart = await this.orderService.getCart(userId);

            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch cart" });
        }
    };

    public updateCartItem = async (req: Request, res: Response) => {
        try {
            const { orderId, itemId, quantity } = req.body;

            await this.orderService.updateCartItem(orderId, itemId, quantity);

            res.status(200).json({ message: "Cart updated" });
        } catch (error) {
            res.status(500).json({ error: "Failed to update cart" });
        }
    };

    public removeFromCart = async (req: Request, res: Response) => {
        try {
            const { orderId, itemId } = req.body;

            await this.orderService.removeFromCart(orderId, itemId);

            res.status(200).json({ message: "Item removed" });
        } catch (error) {
            res.status(500).json({ error: "Failed to remove item" });
        }
    };

public checkout = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            userId,
            paymentMethod,
            phone
        } = req.body;



        /**
         * ================= MPESA =================
         */

        if (paymentMethod === "MPESA") {

            /**
             * ================= GET CART =================
             */

            const cart =
                await this.orderService.getCart(
                    userId
                );



            if (!cart.length) {

                return res.status(400).json({
                    message: "Cart is empty"
                });
            }



            /**
             * ================= TOTAL =================
             */

            const totalAmount =
                cart[0].TotalAmount;



            /**
             * ================= CREATE PENDING ORDER =================
             */

          await this.orderService.checkout(
    userId,
    "MPESA",
    phone
);



            /**
             * ================= MPESA STK PUSH =================
             */

            const mpesaService =
                new MpesaService();

            const response =
                await mpesaService.stkPush(
                    phone,
                    totalAmount
                );



            return res.status(200).json(
                response
            );
        }



        /**
         * ================= PAY ON DELIVERY =================
         */

        const response =
            await this.orderService.checkout(
                userId,
                paymentMethod
            );



        return res.status(200).json(
            response
        );

    } catch (error: any) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
}
public getUserOrders = async (
    req: Request,
    res: Response
) => {

    try {

        const userId = Number(req.params.userId);

        const orders =
            await this.orderService.getUserOrders(userId);

        res.status(200).json(orders);

    } catch (error: any) {

        res.status(500).json({
            message: error.message
        });

    }

}

public getAllOrders = async (
    req: Request,
    res: Response
) => {

    try {

        const orders =
            await this.orderService.getAllOrders();

        res.status(200).json(orders);

    } catch (error: any) {

        res.status(500).json({
            message: error.message
        });

    }

}
}