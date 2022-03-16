import {authMiddleware} from "Server/Utils/authMiddleware";
import Service from "Server/Services/Service";
import constants from "Shared/constants";


export default class Orders extends Service {
    register(){
        const router = super.register();

        // protect behind auth
        router.use("*", authMiddleware);

        // get orders count
        router.get("/count", async (req, res) => {
            return res.json(await this.count(req.query));
        });

        // get all orders
        router.get("/", async (req, res) => {
            return res.json(await this.list(req.query));
        });

        // get a single order
        router.get("/:orderID", async (req, res) => {
            return res.json(await this.get(Number(req.params.orderID)));
        });

        return router;
    }

    async count(options: any): Promise<number> { return constants.ordersPerRequest };

    async list(options: any): Promise<Order[]> { return [] };

    async get(id: number): Promise<Order> { return null };
}
