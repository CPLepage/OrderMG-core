import express from "express";
import path from "path";
import Orders from "src/Services/Orders";

const app = express();

app.use("/", express.static(path.resolve(__dirname, './webapp')));

const servicesBasePath = process.env.BASE_PATH ?? "/api";
app.use(servicesBasePath, Orders);

const listenPort = process.env.PORT ?? 9005;
app.listen(listenPort);

console.log("OrderMG listening at http://localhost:" + listenPort);
