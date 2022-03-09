import axios from "axios";
import constants from "@shared/constants";
import DataStore from "DataStores/DataStore";

export default class OrderStore extends DataStore{
    loaded: boolean = false;
    loading: boolean = false;
    private expectedCount: number = 0;
    orders: Order[];

    get count(): number {
        if(!this.orders || this.loading)
            return this.expectedCount;

        return this.orders.length;
    };

    static getInstance(): OrderStore{
        if(!OrderStore.instance)
            OrderStore.instance = new OrderStore();

        return OrderStore.instance as OrderStore;
    }

    private async loadOrders(cursor: number){
        const orders = (await axios.get(`/order?cursor=${cursor}`)).data;
        this.orders = this.orders.concat(orders);
        this.notifySubscribers();
    }

    async load(){
        this.loaded = true;
        this.loading = true;

        this.expectedCount = (await axios.get("/order/count")).data;
        this.orders = [];

        this.notifySubscribers();

        const orderRequests = new Array(Math.ceil(this.count / constants.ordersPerRequest)).fill(null)
            .map((req, index) => this.loadOrders(index));

        await Promise.all(orderRequests);

        this.loading = false;

        setTimeout(this.notifySubscribers.bind(this), 200);
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
