const express = require("express");
const authRouter = require("./auth");
const foodRouter = require("./food");
const drinkRouter = require("./drink");
const itemRouter = require("./item");

const app = express();

app.use("/auth/", authRouter);
app.use("/food/", foodRouter);
app.use("/drink/", drinkRouter);
app.use("/item/", itemRouter);

module.exports = app;