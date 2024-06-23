const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/'); // Specify the path where files should be stored
    },
    filename: (req, file, callback) => {
        const fileName = nanoid(10) + path.extname(file.originalname);
        callback(null, fileName); // Generate a unique filename and use the original extension
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true); // Accept file if its type is in allowedTypes
    } else {
        callback(new Error('Only PDF, Word, Excel, PowerPoint, JPG/JPEG, and PNG files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 }, // Limit file size to 1MB
    fileFilter: fileFilter
}).single('file'); // Specify the field name ('file') from which files are coming

module.exports = { upload };

