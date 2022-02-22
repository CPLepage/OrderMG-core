import express from "express";
import path from "path";

const app = express();

app.use("/", express.static(path.resolve(__dirname, './webapp')));

app.listen(9005);
console.log("OrderMG listening at http://localhost:9005");
