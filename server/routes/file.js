const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');


router.post('/upload', validateToken, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json(err);
        } else if (req.file == undefined) {
            res.status(400).json({ message: "No file uploaded" });
        } else {
            res.json({ filename: req.file.filename });
        }
    });
});

// Route to delete a file
router.delete('/delete/:filename', validateToken, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../public/uploads/', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file', error: err.message });
        }
        res.json({ message: 'File deleted successfully' });
    });
});

module.exports = router;
