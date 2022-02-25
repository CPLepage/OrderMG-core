import express from "express";
import path from "path";
import Auth from "src/Services/Auth";
import Orders from "src/Services/Orders";

const app = express();

app.use("/", express.static(path.resolve(__dirname, './webapp')));

const basePath = "/api";
app.use(basePath + "/auth", Auth);
app.use(basePath + "/order", Orders);

const listenPort = process.env.PORT ?? 9005;
app.listen(listenPort);

console.log("OrderMG listening at http://localhost:" + listenPort);
