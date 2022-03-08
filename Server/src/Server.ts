import express from "express";
import Auth from "src/Services/Auth";
import * as path from "path";
import {ServiceEnum} from "src/Services/Enum";
import Service from "src/Services/Service";
import Orders from "src/Services/Orders";
import http from "http";

export default class Server {
    static services: Map<ServiceEnum, Service> = new Map();
    static httpServer: http.Server;
    static app = express();

    // default services
    constructor() {
        Server.services.set(ServiceEnum.ORDERS, new Orders());
        Server.services.set(ServiceEnum.AUTH, new Auth());
    }

    static loadServices(){
        const basePath = "/api";
        Server.services.forEach((service, serviceName) => {
            Server.app.use(basePath + "/" + serviceName, Server.services.get(serviceName).register());
        });
    }

    static registerWebApp(){
        const webappFolder = path.resolve(__dirname, './webapp');
        Server.app.use(express.static(webappFolder));
        Server.app.get("*", function(req, res){
            return res.sendFile(webappFolder + "/index.html");
        });
    }

    static start(silent: boolean = false){
        Server.loadServices();
        Server.registerWebApp();

        const listenPort = process.env.PORT ?? 9005;
        Server.httpServer = Server.app.listen(listenPort);

        if(silent)
            return;

        console.log("OrderMG listening at http://localhost:" + listenPort);
    }
}
