const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files from the main directory
app.use(express.static(path.join(__dirname, '/')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'htmlFiles/index.html'));
});

// Redirect any requests for HTML files to the htmlFiles directory
app.get('/:page.html', (req, res) => {
  const pageName = req.params.page;
  res.sendFile(path.join(__dirname, `htmlFiles/${pageName}.html`));
});

// Start server
app.listen(port, () => {
  console.log(`EventFinder app running at http://localhost:${port}`);
});