const express = require("express");
const UserPages = require("./UserPages")
const ShopkeeperPages = require("./ShopkeeperPages");

const Router = express.Router();

Router.use("/users" , UserPages);
Router.use("/shopkeeper" , ShopkeeperPages);

module.exports = {
    Router
}

