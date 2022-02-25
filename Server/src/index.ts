import express from "express";
import path from "path";
import Auth from "src/Services/Auth";
import Orders from "src/Services/Orders";

const app = express();

const basePath = "/api";
app.use(basePath + "/auth", Auth);
app.use(basePath + "/order", Orders);

const webappFolder = path.resolve(__dirname, './webapp');
app.use(express.static(webappFolder));
app.get("*", function(req, res){
    return res.sendFile(webappFolder + "/index.html");
});

const listenPort = process.env.PORT ?? 9005;
app.listen(listenPort);

console.log("OrderMG listening at http://localhost:" + listenPort);
