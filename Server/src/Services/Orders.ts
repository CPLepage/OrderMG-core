import {Router} from "express";

const router = Router();

router.get("/order", async function(req, res) {
    return res.json(await getAllOrders());
});

export default router;
