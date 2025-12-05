// backend/src/controllers/reviewController.js
const model = require('../models/reviewModel');
const BASE = process.env.BASE_URL || 'http://localhost:4000';


module.exports = {
async addReview(req, res) {
    try {
      console.log('addReview body:', req.body);
      console.log('files count:', req.files && req.files.length);

      const { product_id, rating, review_text, customer_name } = req.body;
      // if you want shop validation remove since DB has no shop column
      if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating required' });

      let images = [];
      if (req.files && req.files.length) {
        images = req.files.map(f => `${BASE}/uploads/${f.filename}`);
      }

      const created = await model.insertReview({
        product_id: Number(product_id),
        rating: Number(rating),
        review_text,
        customer_name
      });

      if (images.length) {
        await model.insertPhotos(created.id, images);
      }

      return res.status(201).json({ success: true, review: created });
    } catch (err) {
      console.error('addReview ERR', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },


async getReviews(req, res) {
try {
const productId = req.params.productId;
const limit = Math.min(Number(req.query.limit || 20), 100);
const offset = Number(req.query.offset || 0);
const rows = await model.getReviewsByProduct(productId, limit, offset);
return res.json({ success: true, reviews: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ error: err });
}
},


async adminList(req, res) {
try {
const rows = await model.adminList();
return res.json({ success: true, reviews: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ error: err });
}
},


async adminDelete(req, res) {
try {
const id = req.params.id;
await model.deleteById(id);
return res.json({ success: true });
} catch (err) {
console.error(err);
return res.status(500).json({ error: err });
}
}
};

