const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const songs = [
  { id: 'hey', title: 'Hey' },
  { id: 'summer', title: 'Summer' },
  { id: 'ukulele', title: 'Ukulele' }
];

app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/music', express.static(path.join(__dirname, '..', 'music')));


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});