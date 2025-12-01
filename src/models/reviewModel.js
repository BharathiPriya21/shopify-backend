// // backend/src/models/reviewModel.js
// const pool = require('../db');


// module.exports = {
// async insertReview({ product_id, shop, rating, review_text, customer_name, images }) {
// const q = `INSERT INTO reviews (product_id, shop, rating, review, images, customer_name) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
// const values = [product_id, shop, rating, review_text || null, images || null, customer_name || null];
// const { rows } = await pool.query(q, values);
// return rows[0];
// },


// async getReviewsByProduct(product_id, limit = 20, offset = 0) {
// const q = `SELECT id, product_id, shop, rating, review, images, customer_name, created_at FROM reviews WHERE product_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
// const { rows } = await pool.query(q, [product_id, limit, offset]);
// return rows;
// },


// async adminList(limit = 200) {
// const { rows } = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC LIMIT $1', [limit]);
// return rows;
// },


// async deleteById(id) {
// await pool.query('DELETE FROM reviews WHERE id=$1', [id]);
// return true;
// }
// };

const pool = require('../db');

module.exports = {
  async insertReview({ product_id, rating, review_text, customer_name }) {
    const q = `INSERT INTO reviews (product_id, rating, comment, customer_name)
               VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [product_id, rating, review_text || null, customer_name || null];
    const { rows } = await pool.query(q, values);
    return rows[0];
  },

  async insertPhotos(review_id, imageUrls = []) {
    if (!imageUrls.length) return;
    const q = `INSERT INTO review_photos (review_id, photo_url) VALUES ($1, $2)`;
    for (const url of imageUrls) {
      await pool.query(q, [review_id, url]);
    }
  },

  async getReviewsByProduct(product_id, limit = 20, offset = 0) {
    const q = `
      SELECT r.id, r.product_id, r.customer_name, r.rating, r.comment AS review, r.created_at,
        (SELECT json_agg(photo_url) FROM review_photos p WHERE p.review_id = r.id) AS photos
      FROM reviews r
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(q, [product_id, limit, offset]);
    return rows;
  },

  async adminList(limit = 200) {
    const q = `
      SELECT r.*, (SELECT json_agg(photo_url) FROM review_photos p WHERE p.review_id = r.id) AS photos
      FROM reviews r
      ORDER BY r.created_at DESC
      LIMIT $1
    `;
    const { rows } = await pool.query(q, [limit]);
    return rows;
  },

  async deleteById(id) {
    await pool.query('DELETE FROM review_photos WHERE review_id=$1', [id]);
    await pool.query('DELETE FROM reviews WHERE id=$1', [id]);
    return true;
  }
};
