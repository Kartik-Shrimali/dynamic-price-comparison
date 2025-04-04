const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authMiddleware } = require("../middleware");


router.post("/add", authMiddleware, async (req, res) => {
    const store_id = req.user.id;
    const product_name = req.body.product_name;
    const brand = req.body.brand;
    const category = req.body.category;
    const price = parseFloat(req.body.price);
    const available = parseInt(req.body.available);
    try {
        if (!product_name || !brand || !category || isNaN(price) || isNaN(available) || price < 0 || available < 0) {
            return res.status(400).json({
                msg: "Please provide all the inputs or check if inputs are valid"
            })
        }

        const [productexists] = await pool.query("SELECT id FROM products WHERE name = ? AND brand = ? AND category = ?", [product_name, brand, category]);

        if (productexists.length > 0) {
            return res.status(400).json({
                msg: "Product already exists"
            })
        }

        const [product] = await pool.query("INSERT INTO products(name , brand , category) VALUES(?,?,?)", [product_name, brand, category]);

        if (product.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error while inserting product"
            })
        }

        const [priceinsertion] = await pool.query("INSERT INTO prices(product_id , store_id , price) VALUES(?,?,?)", [product.insertId, store_id, price]);

        if (priceinsertion.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error while inserting price"
            })
        }

        const [availabilityinsertion] = await pool.query("INSERT INTO availability(product_id , store_id , available) VALUES(?,?,?)", [product.insertId, store_id, available]);

        if (availabilityinsertion.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error while inserting availability"
            })
        }

        return res.status(200).json({
            msg: "Product added successfully"
        })

    } catch (err) {
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }
})

router.post("/update", authMiddleware, async (req, res) => {
    const store_id = req.user.id;
    const product_id = req.body.product_id;
    const price = parseFloat(req.body.price);
    const available = parseInt(req.body.available);

    try {
        if (!product_id || isNaN(price) || isNaN(available) || price < 0 || available < 0) {
            return res.status(400).json({
                msg: "provide all the inputs and verify the values of inputs"
            })
        }

        const [productexists] = await pool.query("SELECT id FROM products WHERE id = ?", [product_id]);

        if (productexists.length === 0) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }

        const [productstore] = await pool.query("select * from prices where product_id = ? and store_id = ?", [product_id, store_id]);

        if (productstore.length === 0) {
            return res.status(403).json({
                msg: "Product not found in this store or you are not allowed to update this product"
            })
        }

        const [updateprice] = await pool.query("UPDATE prices SET price = ? WHERE product_id = ? AND store_id = ?", [price, product_id, store_id]);

        if (updateprice.affectedRows === 0) {
            return res.status(400).json({
                msg: "No changes made in price"
            })
        }

        const [updateavailability] = await pool.query("update availability set available = ? where product_id = ? and store_id = ?", [available, product_id, store_id]);

        if (updateavailability.affectedRows === 0) {
            return res.status(400).json({
                msg: "No changes made in availability"
            })
        }

        return res.status(200).json({
            msg: "Product updated successfully"
        })

    } catch (err) {
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }
})

router.delete("/delete", authMiddleware, async (req, res) => {
    const store_id = req.user.id;
    const product_id = req.body.id;

    try {
        if (!product_id) {
            return res.status(400).json({
                msg: "provide product id"
            })
        }
        const [productexists] = await pool.query("SELECT id FROM products WHERE id = ?", [product_id]);
        if (productexists.length === 0) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }

        const [pricedeleted] = await pool.query("DELETE FROM prices WHERE product_id = ? AND store_id = ?", [product_id, store_id]);

        if (pricedeleted.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error while deleting price"
            })
        }

        const [availabilitydeleted] = await pool.query("DELETE FROM availability WHERE product_id = ? AND store_id = ?", [product_id, store_id]);

        if (availabilitydeleted.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error while deleting availability"
            })
        }

        const [productStores] = await pool.query(
            "SELECT * FROM prices WHERE product_id = ?",
            [product_id]
        );

        if (productStores.length === 0) {
            const [productdeleted] = await pool.query("DELETE FROM products WHERE id = ?", [product_id]);
            if (productdeleted.affectedRows === 0) {
                return res.status(400).json({
                    msg: "There was some error while deleting product"
                })
            }
        }

        return res.status(200).json({
            msg: "Product deleted successfully"
        })


    } catch (err) {
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }
})

router.get("/products", authMiddleware, async (req, res) => {
    const store_id = req.user.id;
    try{
        const [products] = await pool.query(`
            SELECT products.id, products.name, products.brand, products.category, 
                   prices.price, 
                   availability.available
            FROM products
            LEFT JOIN prices ON products.id = prices.product_id AND prices.store_id = ?
            LEFT JOIN availability ON products.id = availability.product_id AND availability.store_id = ?
            WHERE prices.store_id IS NOT NULL OR availability.store_id IS NOT NULL
        `, [store_id, store_id]);
        
        if(products.length === 0){
            return res.status(404).json({
                msg: "No products found"
            })
        }

        return res.status(200).json(products);
    }catch(err){
        return res.status(500).json({
            msg: "There was some internal server error",
            error: err.message
        })
    }
})

module.exports = router

