import express from "express";
import path from "path";

const app = express();

app.use("/", express.static(path.resolve(__dirname, './webapp')));

const listenPort = process.env.PORT ?? 9005;
app.listen(listenPort);

console.log("OrderMG listening at http://localhost:" + listenPort);
