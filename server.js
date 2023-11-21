const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;


// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));

// Endpoint to handle file uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const filename = Date.now() + path.extname(originalname);
    const imagePath = `uploads/${filename}`;

    // Resize and convert to webp
    await sharp(buffer)
      .resize({ width: 800 })
      .toFormat('webp')
      .toFile(`public/${imagePath}`);

    res.send('File uploaded successfully!');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to retrieve image gallery data
app.get('/images', (req, res) => {
  try {
    const imageFiles = fs.readdirSync(path.join(__dirname, 'public', 'uploads'));
    const images = imageFiles.map(filename => ({
      filename,
      path: `uploads/${filename}`,
    }));
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Internal Server Error');
  }
});








app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
