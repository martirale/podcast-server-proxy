const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3010; // OR THE PORT THAT YOU MOST WANT
const rssUrl = 'YOUR RSS SOURCE';

app.use(cors());

app.get('/api/podcast', async (req, res) => {
  const parser = new Parser();

  try {
    const feed = await parser.parseURL(rssUrl);
    res.json(feed.items);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Error fetching RSS feed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
