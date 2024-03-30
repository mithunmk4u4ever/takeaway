const express = require('express');
const multer = require('multer');
const router = express.Router();
const Image=require('../models/imagedetails')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  },
});
const upload = multer({ storage: storage })


router.post('/upload', upload.single('image'), async (req, res) => {
  console.log(req.body)
  res.send("Uploaded")
  const { name } = req.body;
  const imagePath = req.file.filename;
  

  try {
    const newImage = new ImageModel({
      name,
      imagePath
    });
    await newImage.save();
    
    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
});

module.exports = router;