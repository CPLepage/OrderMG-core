import {Router} from "express";

const router = Router();

declare function getAllOrders(): any[];
router.get("/order", (req, res) => {
    return res.json(typeof getAllOrders === 'undefined' ? [] : getAllOrders());
});

export default router;
