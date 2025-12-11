// backend/src/routes/reviews.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/reviewController');


// public
//router.post('/review', upload.single('images'), ctrl.addReview); // add review
router.post('/review', upload.array('images'), ctrl.addReview);

router.get('/:productId', ctrl.getReviews); // get reviews


// admin
router.get('/admin/list', ctrl.adminList);
router.delete('/admin/:id', ctrl.adminDelete);


module.exports = router;