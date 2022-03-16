import faker from "@faker-js/faker";
import Server from "Server/Server";
import Orders from "Server/Services/Orders/Orders";
import {ServiceEnum} from "Server/Services/Enum";
import constants from "Shared/constants";
import {randomIntFromInterval, sleep} from "Server/Utils/utils";

function generateOrder(){
    return {
        id: faker.datatype.number(),
        shippingAddress: {
            postcode: faker.address.zipCode()
        }
    }
}

class fakerOrdersService extends Orders {
    readonly ordersCount = 100;
    cachedFakedOrder;

    async count(options: any): Promise<number> {
        return this.ordersCount;
    }

    async list(options: any): Promise<any[]> {
        if(!this.cachedFakedOrder)
            this.cachedFakedOrder = new Array(this.ordersCount).fill(null).map(() => generateOrder());

        // sleep between 1s and 3s
        await sleep(randomIntFromInterval(1000, 3000));

        const cursorPos = options && options.cursor ? options.cursor : 0;
        const cursorIndex = cursorPos * constants.ordersPerRequest;
        return this.cachedFakedOrder.slice(cursorIndex, cursorIndex + constants.ordersPerRequest);
    }

    async get(id: number): Promise<Order> {
        for (let i = 0; i < this.cachedFakedOrder.length; i++) {
            if(this.cachedFakedOrder[i].id === id)
                return this.cachedFakedOrder[i];
        }

        return null;
    }
}

Server.services.set(ServiceEnum.ORDERS, new fakerOrdersService());
