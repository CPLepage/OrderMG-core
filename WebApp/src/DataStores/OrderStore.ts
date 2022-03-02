import axios from "axios";

export default class OrderStore {
    static instance: OrderStore;
    public initializing: boolean = false;
    private subscribers: Set<() => void> = new Set();
    orders: Order[];

    constructor(subscriber: () => void = null) {
        OrderStore.instance = this;

        if(subscriber)
            this.subscribe(subscriber);

        this.init();
    }

    private async init(){
        this.initializing = true;
        this.subscribers.forEach(subscriber => subscriber());
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
