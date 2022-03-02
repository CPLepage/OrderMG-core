import express from "express";
import Orders from "src/Services/Orders";
import Auth from "src/Services/Auth";
import * as path from "path";
import {ServiceEnum} from "src/Services/Enum";
import Service from "src/Services/Service";

export default class Server {
    static services: Map<string, Service> = new Map(Object.entries({
        [ServiceEnum.ORDERS]:   new Orders(),
        [ServiceEnum.AUTH]  :   new Auth()
    }));
    static app = express();

    static registerServices(){
        const basePath = "/api";
        console.log(Server.services)
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

    start(){
        Server.registerServices();
        Server.registerWebApp();

        const listenPort = process.env.PORT ?? 9005;
        Server.app.listen(listenPort);

        console.log("OrderMG listening at http://localhost:" + listenPort);
    }
}

setTimeout(new Server().start, 1);

