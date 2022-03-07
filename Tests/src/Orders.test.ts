import {describe, it, after} from "mocha";
import * as assert from "assert";
import "src/index";
import Server from "src/Server";
import Orders from "src/Services/Orders";
import {ServiceEnum} from "src/Services/Enum";

describe('Orders', function () {
    after(function () {
        Server.httpServer.close();
    });

    it('should return a list of order with ids', async function () {
        const orders = await (Server.services.get(ServiceEnum.ORDERS) as Orders).list(null);

        assert.ok(Array.isArray(orders));

        orders.forEach(order => assert.ok(Object.keys(order).includes("id")));
    });

});
