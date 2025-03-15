const express = require("express");
const router = express.Router();
const pool = require("../db")
const { JWT_SECRET } = require("../JWT_SECRET")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware")

router.get("/", authMiddleware, async (req, res) => {
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
            return res.status(404).json({
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

router.get("/prices", authMiddleware, async (req, res) => {
    const ProductId = parseInt(req.query.id);

    try {
        if (!ProductId) {
            return res.status(400).json({
                msg: "provide a product id"
            })
        }

        let query = `SELECT stores.name as store_name,
                                prices.price,
                                prices.availability,
                                prices.updated_at 
                          FROM prices
                          JOIN stores ON prices.store_id = stores.id
                          WHERE prices.product_id = ?
                          ORDER BY prices.price ASC`;

        let [response] = await pool.query(query, [ProductId]);

        if (response.length === 0) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }

        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            msg: "There was some intetrnal error",
            error : err.message
        })
    }

})

router.get("/availability", authMiddleware, async (req, res) => {
    let ProductId = parseInt(req.query.id);

    try {
        if (!ProductId) {
            return res.status(400).json({
                msg: "No id is provided.Please provide id"
            })
        }

        let query = `SELECT stores.name as store_name,
                    prices.availability,
                    prices.updated_at
                    FROM prices
                    JOIN stores ON prices.store_id = stores.id
                    WHERE prices.product_id = ? AND prices.availability = 1`;

        let [response] = await pool.query(query , [ProductId]);

        if(response.length === 0){
            return res.status(404).json({
                msg : "The product is not available OR out of stock"
            })
        }

        return res.status(200).json(response);

    } catch (err) {
        return res.status(500).json({
            msg : "There was some error in server",
            error : err.message
        })
    }

})

module.exports = router