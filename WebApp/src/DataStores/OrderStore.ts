import axios from "axios";
import constants from "@shared/constants";

export default class OrderStore {
    static instance: OrderStore;
    loaded: boolean = false;
    loading: boolean = false;
    private subscribers: Set<() => void> = new Set();
    count: number;
    orders: Order[];

    static getInstance(){
        if(!OrderStore.instance)
            OrderStore.instance = new OrderStore();

        return OrderStore.instance;
    }

    private async load(){
        this.loading = true;

        this.count = (await axios.get("/order/count")).data;

        const orderRequests = new Array(this.count / constants.ordersPerRequest)
        console.log(orderRequests);

        this.orders = (await axios.get("/order")).data;
        this.loaded = true;

        this.subscribers.forEach(subscriber => subscriber());
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
