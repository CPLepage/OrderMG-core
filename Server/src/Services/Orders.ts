import {Router} from "express";

const router = Router();

declare function getAllOrders(): any[] | Promise<any[]>;
router.get("/order", async function(req, res) {
    if(typeof getAllOrders === 'undefined')
        return res.json([]);

    const orders = getAllOrders();

    if(orders instanceof Promise)
        return res.json(await orders);

    return res.json(orders);
});

export default router;
