const express = require("express");
const router = express.Router();
const pool = require("../db")
const { JWT_SECRET } = require("../JWT_SECRET")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware")

router.get("/", authMiddleware , async (req, res) => {
    try {
        const Pid = parseInt(req.query.id);


        let query = "SELECT id , name , brand , category FROM products";
        let queryValue = [];
        let products = [];

        if (Pid) {
            queryValue.push(Pid);

            let condition = " WHERE id = ?"
            query = query + condition;
            [products] = await pool.query(query, queryValue);
        }
        else {
            [products] = await pool.query(query);
        }

        if (Pid && products.length === 0) {
            return res.status(400).json({
                msg: "Product not found"
            })
        }

        return res.status(200).json(products)

    } catch (err) {
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }
})

router.get("/prices" , authMiddleware , async (req , res)=>{
    // const ProductId = parseInt(req.query.id);

    // if(!ProductId){
    //     return res.json({
    //         msg : "provide a product id"
    //     })
    // }

    // await pool.query("SELECT ")
})


module.exports = router