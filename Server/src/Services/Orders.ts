import {Router} from "express";
import {authMiddleware} from "src/Utils/authMiddleware";

const router = Router();

// protect behind auth
router.use("*", authMiddleware);

// get orders count
router.get("/count", async function(req, res) {
    //@overrideable
    return res.json(await getOrdersCount(req.query));
});

// get all orders
router.get("/", async function(req, res) {
    //@overrideable
    return res.json(await getOrders(req.query));
});

// get a single order
router.get("/:orderID", async function(req, res){
    //@overrideable
    return res.json(await getOrder(Number(req.params.orderID)));
});

export default router;
