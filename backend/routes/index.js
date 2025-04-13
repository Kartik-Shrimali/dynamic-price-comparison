const express = require("express");
const UserPages = require("./UserPages")
const ShopkeeperPages = require("./ShopkeeperPages");
const User_Products = require("./User_Products");
const user_Alerts = require("./user_Alerts");
const Shopkeeper_Products = require("./Shopkeeper_Products");
const Router = express.Router();

Router.use("/users" , UserPages);
Router.use("/shopkeeper" , ShopkeeperPages);
Router.use("/user/products" ,User_Products );
Router.use("/user/alerts" ,user_Alerts);
Router.use("/store/products" , Shopkeeper_Products);

module.exports =  Router


