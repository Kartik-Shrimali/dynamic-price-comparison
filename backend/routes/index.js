const express = require("express");
const UserPages = require("./UserPages")
const ShopkeeperPages = require("./ShopkeeperPages");
const User_Products = require("./User_Products");
const Router = express.Router();

Router.use("/users" , UserPages);
Router.use("/shopkeeper" , ShopkeeperPages);
Router.use("/user/products" ,User_Products );

module.exports = {
    Router
}

