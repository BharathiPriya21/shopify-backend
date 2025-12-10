const express = require("express");
const router = express.Router();
const axios = require("axios");

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const FRONTEND_URL = "https://shopify-frontend-henna.vercel.app";

router.get("/auth", (req, res) => {
    const shop = req.query.shop;
    if (!shop) return res.status(400).send("Missing shop");

    const redirectUri = "https://shopify-backend-pqh8.onrender.com/auth/callback";
    const scopes = "read_customers,write_customers,read_products,write_products";

    const installUrl =
      `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${redirectUri}`;

    res.redirect(installUrl);
});

router.get("/auth/callback", async (req, res) => {
    try {
        const { shop, code } = req.query;
        const tokenUrl = `https://${shop}/admin/oauth/access_token`;

        const tokenRes = await axios.post(tokenUrl, {
            client_id: SHOPIFY_API_KEY,
            client_secret: SHOPIFY_API_SECRET,
            code
        });

        const accessToken = tokenRes.data.access_token;

        
        console.log("Shop installed:", shop, accessToken);

        // Redirect to FE
        return res.redirect(`${FRONTEND_URL}/?shop=${shop}`);
    } catch (err) {
        console.error("OAuth error", err);
        res.status(500).send("OAuth failed");
    }
});

module.exports = router;
