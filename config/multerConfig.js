const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/songs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Establecer un nombre único
    }
});

// Aquí se exporta el middleware 'upload'
const upload = multer({ storage: storage });

module.exports = upload;


