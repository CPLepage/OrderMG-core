import axios from "axios";

export default class OrderStore {
    static instance: OrderStore;
    public initializing: boolean = false;
    private subscribers: Set<() => void> = new Set();
    orders: Order[];

    constructor() {
        OrderStore.instance = this;
        this.init();
    }

    private async init(){
        this.initializing = true;
        const ordersCount = (await axios.get("/order/count")).data;
        this.orders = (await axios.get("/order")).data;
        this.initializing = false;
        this.subscribers.forEach(subscriber => subscriber());
    }

    public subscribe(callback: () => void) {
        this.subscribers.add(callback);
    }

    getOrders(): Order[]{
        return this.orders;
    }

    getOrder(id: number){
        for (let i = 0; i < this.orders.length; i++) {
            if(this.orders[i].id === id)
                return this.orders[i];
        }
    }

}
