import faker from "@faker-js/faker";
import Server from "src/Server";
import Orders from "src/Services/Orders";
import {ServiceEnum} from "src/Services/Enum";

function generateOrder(){
    return {
        id: faker.datatype.number(),
        shippingAddress: {
            postcode: faker.address.zipCode()
        }
    }
}

class customOrdersService extends Orders {
    readonly ordersCount = 25;
    cachedFakedOrder;

    async list(options: any): Promise<any[]> {
        return [generateOrder()];
    }
}

Server.services.set(ServiceEnum.ORDERS, new customOrdersService());
