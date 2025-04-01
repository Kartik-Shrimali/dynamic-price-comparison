const express = require("express");
const router = express.Router();
const pool = require("../db")
const { JWT_SECRET } = require("../JWT_SECRET")
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("../middleware")

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
                     availability.available as availability,
                     prices.updated_at 
                     FROM prices
                     JOIN stores ON prices.store_id = stores.id
                     JOIN availability ON availability.store_id = stores.id 
                     AND availability.product_id = prices.product_id
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
            error: err.message
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
                     availability.available as availability,
                     prices.updated_at
                     FROM availability
                     JOIN stores ON availability.store_id = stores.id
                     JOIN prices ON prices.store_id = stores.id AND prices.product_id = availability.product_id
                     WHERE availability.product_id = ? AND availability.available = true`;


        let [response] = await pool.query(query, [ProductId]);

        if (response.length === 0) {
            return res.status(404).json({
                msg: "The product is not available OR out of stock"
            })
        }

        return res.status(200).json(response);

    } catch (err) {
        return res.status(500).json({
            msg: "There was some error in server",
            error: err.message
        })
    }

})

router.put("/update", authMiddleware, async (req, res) => {
    const user_id = req.user.id;
    const product_id = req.body.product_id;
    const store_id = req.body.store_id;
    const new_price = req.body.new_price;

    try {
        if (!product_id || !store_id || !new_price) {
            return res.status(400).json({
                msg: "Please provide all the inputs "
            })
        }


        const [oldPrice] = await pool.query("SELECT price FROM prices WHERE store_id = ? AND product_id = ?", [store_id, product_id]);

        if (oldPrice.length === 0) {
            return res.status(400).json({
                msg: "Price not found for this product in this store "
            })
        }
        const old_price = oldPrice[0].price;

        await pool.query("INSERT INTO price_history (price_id, old_price, changed_at) VALUES ((SELECT id FROM prices WHERE store_id = ? AND product_id = ?), ?, NOW())",[store_id, product_id, old_price]);

        await pool.query("UPDATE prices SET price = ? , updated_at = NOW() WHERE store_id = ? AND product_id = ?",[new_price , store_id , product_id]);

        return res.status(200).json({
            msg : "Price updated successfully",
            old_price : old_price,
            new_price : new_price
        }
        )

    } catch (err) {
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }

})

module.exports = router