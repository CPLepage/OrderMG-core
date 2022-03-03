import axios from "axios";
import constants from "@shared/constants";

export default class OrderStore {
    static instance: OrderStore;
    loaded: boolean = false;
    loading: boolean = false;
    private subscribers: Set<() => void> = new Set();
    private expectedCount: number = 0;
    orders: Order[];
    get count(): number {
        if(!this.orders || this.loading)
            return this.expectedCount;

        return this.orders.length;
    };

    static getInstance(){
        if(!OrderStore.instance)
            OrderStore.instance = new OrderStore();

        return OrderStore.instance;
    }

    private notifySubscriber(){
        this.subscribers.forEach(subscriber => subscriber());
    }

    private async loadOrders(cursor: number){
        const orders = (await axios.get(`/order?cursor=${cursor}`)).data;
        this.orders = this.orders.concat(orders);
        this.notifySubscriber();
    }

    async load(){
        this.loaded = true;
        this.loading = true;

        this.expectedCount = (await axios.get("/order/count")).data;
        this.orders = [];

        this.notifySubscriber();

        const orderRequests = new Array(Math.ceil(this.count / constants.ordersPerRequest)).fill(null)
            .map((req, index) => this.loadOrders(index));

        await Promise.all(orderRequests);

        this.loading = false;

        setTimeout(this.notifySubscriber.bind(this), 200);
    }

    subscribe(callback: () => void) {
       this.subscribers.add(callback);
    }

    getAll(): Order[]{
        if(!this.loaded) {
            this.load();
            return null;
        }

        return this.orders;
    }

    get(id: number){
        for (let i = 0; i < this.orders.length; i++) {
            if(this.orders[i].id === id)
                return this.orders[i];
        }
    }

}
