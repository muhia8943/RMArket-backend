import { Router } from "express";
import { OrderController,  } from "../controller/orders.controller";

const router = Router();
const controller = new OrderController();

router.post("/cart", controller.addToCart);
router.get("/cart/:userId", controller.getCart);
router.put("/cart", controller.updateCartItem);
router.delete("/cart", controller.removeFromCart);
router.post(
    "/checkout",
    controller.checkout
)
router.get(
    "/user-orders/:userId",
    controller.getUserOrders
);

router.get(
    "/admin/orders",
    controller.getAllOrders
);
export default router;