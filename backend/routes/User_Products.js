const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authMiddleware } = require("../middleware");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const Pid = parseInt(req.query.id);
        let query = "SELECT id, name, brand, category FROM products";
        let queryValue = [];

        if (Pid) {
            query += " WHERE id = ?";
            queryValue.push(Pid);
        }

        const [products] = await pool.query(query, queryValue);

        if (Pid && products.length === 0) {
            return res.status(404).json({ msg: "Product not found" });
        }

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});

router.get("/prices", authMiddleware, async (req, res) => {
    const ProductId = parseInt(req.query.id);

    try {
        if (!ProductId) {
            return res.status(400).json({ msg: "Provide a product id" });
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

        const [response] = await pool.query(query, [ProductId]);

        if (response.length === 0) {
            return res.status(404).json({ msg: "Product not found" });
        }

        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});

router.get("/availability", authMiddleware, async (req, res) => {
    let ProductId = parseInt(req.query.id);

    try {
        if (!ProductId) {
            return res.status(400).json({ msg: "No id provided. Please provide an id" });
        }

        let query = `SELECT stores.name as store_name, 
                            availability.available as availability, 
                            COALESCE(prices.updated_at, NULL) as updated_at
                     FROM availability
                     JOIN stores ON availability.store_id = stores.id
                     LEFT JOIN prices ON prices.store_id = stores.id 
                     AND prices.product_id = availability.product_id
                     WHERE availability.product_id = ? 
                     AND availability.available = true`;

        const [response] = await pool.query(query, [ProductId]);

        if (response.length === 0) {
            return res.status(404).json({ msg: "The product is not available or out of stock" });
        }

        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});

router.put("/update", authMiddleware, async (req, res) => {
    const { product_id, store_id, new_price } = req.body;

    try {
        if (!product_id || !store_id || !new_price) {
            return res.status(400).json({ msg: "Please provide product_id, store_id, and new_price" });
        }

        const [oldPrice] = await pool.query(
            "SELECT id, price FROM prices WHERE store_id = ? AND product_id = ?", 
            [store_id, product_id]
        );

        if (oldPrice.length === 0) {
            return res.status(404).json({ msg: "Price not found for this product in this store" });
        }

        const old_price = oldPrice[0].price;
        const price_id = oldPrice[0].id;

        await pool.query(
            "INSERT INTO price_history (price_id, old_price, changed_at) VALUES (?, ?, NOW())", 
            [price_id, old_price]
        );

        await pool.query(
            "UPDATE prices SET price = ?, updated_at = NOW() WHERE store_id = ? AND product_id = ?", 
            [new_price, store_id, product_id]
        );

        return res.status(200).json({
            msg: "Price updated successfully",
            old_price,
            new_price
        });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});

// GET /user/products/:productId/compare
router.get('/:productId/compare', authMiddleware, async (req, res) => {
    const productId = parseInt(req.params.productId);

    try {
        const [data] = await pool.query(`
            SELECT 
                s.name AS store_name,
                s.rating,
                s.delivery_time_days,
                p.price,
                a.available,
                p.updated_at
            FROM prices p
            JOIN stores s ON p.store_id = s.id
            LEFT JOIN availability a 
              ON a.store_id = p.store_id AND a.product_id = p.product_id
            WHERE p.product_id = ?
            ORDER BY p.price ASC
        `, [productId]);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No pricing data found for this product" });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});


module.exports = router;
