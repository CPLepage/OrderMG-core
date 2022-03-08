import {after, describe, it} from "mocha";
import * as assert from "assert";
import Server from "src/Server";
import supertest from "supertest";
import Auth from "src/Services/Auth";
import {init} from "src/init";

describe('Auth', function () {
    let accessToken;
    let refreshToken;

    before(async function () {
        await init(true)
    });

    after(function () {
        Server.httpServer.close();
    });

    it('/GET auth : should return a Token',  async function (){
        const response = await supertest(Server.httpServer).get("/api/auth");
        accessToken = response.body?.accessToken ?? undefined;
        refreshToken = response.body?.refreshToken ?? undefined;
    });

    it('/GET auth/validate : should return a valid boolean',  async function(){
        const response = await supertest(Server.httpServer)
            .get("/api/auth/validate")
            .set("authorization", accessToken ?? "");

        if(accessToken)
            assert.ok(response.body?.valid);
    });

    it('/GET auth/refreshToken : should return a new Token', async function() {
        const response = await supertest(Server.httpServer)
            .get("/api/auth/refreshToken?refreshToken=" + refreshToken)
            .set("authorization", accessToken ?? "");

        if(!accessToken)
            return;

        assert.notEqual(response.body?.accessToken, accessToken);
    });

    it('/GET auth/logout : should return a success boolean', async function() {
        const response = await supertest(Server.httpServer)
            .get("/api/auth/logout?refreshToken=" + refreshToken)
            .set("authorization", accessToken ?? "");

        if(!accessToken)
            return;

        assert.ok(response.body?.success);
    });
});
