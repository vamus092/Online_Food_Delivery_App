const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = './uploads'; // default folder
    fs.mkdirSync(folder, { recursive: true }); // ensure folder exists
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// IMPORTANT: field name must match frontend FormData key
const uploadsingleMiddleware = upload.single("image");

module.exports = uploadsingleMiddleware;
