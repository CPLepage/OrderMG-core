import {Router} from "express";
import {authMiddleware} from "src/Utils/authMiddleware";

const router = Router();

// protect behind auth
router.use("*", authMiddleware);

// get all orders
router.get("/order", async function(req, res) {
    //@overrideable
    return res.json(await getOrders(req.query));
});

// get a single order
router.get("/order/:orderID", async function(req, res){
    //@overrideable
    return res.json(await getOrder(Number(req.params.orderID)));
});

export default router;
