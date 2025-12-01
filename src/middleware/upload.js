// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });


const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, UPLOAD_DIR),
filename: (req, file, cb) => {
const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
cb(null, `${unique}${path.extname(file.originalname)}`);
}
});


const fileFilter = (req, file, cb) => {
const allowed = /jpeg|jpg|png|webp|gif/;
const ext = path.extname(file.originalname).toLowerCase();
if (allowed.test(file.mimetype) && allowed.test(ext)) cb(null, true);
else cb(new Error('Invalid file type'));
};


const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = upload;