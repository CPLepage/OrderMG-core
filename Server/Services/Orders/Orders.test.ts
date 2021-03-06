import {after, describe, it} from "mocha";
import * as assert from "assert";
import Server from "Server/Server";
import Orders from "Server/Services/Orders/Orders";
import {ServiceEnum} from "Server/Services/Enum";
import supertest from "supertest";
import {randomIntFromInterval} from "Server/Utils/utils";
import Auth from "Server/Services/Auth/Auth";
import {init} from "Server/init";
import constants from "Shared/constants";

describe('Orders', function () {
    let accessToken;

    before(async function (){
        await init(true);
        const token = (await (Server.services.get(ServiceEnum.AUTH) as Auth).login(constants.testUser, constants.testPass));
        accessToken = token?.accessToken ?? "";
    });

    after(function () {
        Server.httpServer.close();
    });

    it('/GET order : should return a list of order with ids',  async function (){
        const response = await supertest(Server.httpServer)
            .get("/api/order")
            .set("authorization", accessToken);
        const orders = response.body;
        assert.ok(Array.isArray(orders));
        orders.forEach(order => assert.ok(Object.keys(order).includes("id")));
    });

    it('/GET order/count : should return an order count',  async function(){
        const response = await supertest(Server.httpServer)
            .get("/api/order/count")
            .set("authorization", accessToken);
        const orderCount: number = response.body;
        assert.ok(typeof orderCount === 'number');
    });

    it('/GET order/:orderID : should return an order', async function() {
        const orderService = Server.services.get(ServiceEnum.ORDERS) as Orders;
        const orders = await orderService.list(null);
        const orderID = orders.length ? orders[0].id : null;
        const response = await supertest(Server.httpServer)
            .get("/api/order/" + (orderID ?? randomIntFromInterval(10000, 99999)))
            .set("authorization", accessToken);
        const receivedOrderID = response.body?.id ?? null;
        assert.equal(orderID, receivedOrderID);
    });
});
