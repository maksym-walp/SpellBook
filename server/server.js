const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const host = '127.1.6.28';

app.use(cors());
app.use(express.json());

const spellsFilePath = path.join(__dirname, 'spells.json');

// API routes
app.get('/api/spells', (req, res) => {
  fs.readFile(spellsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the spells file.');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/spells/:id', (req, res) => {
    fs.readFile(spellsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while reading the spells file.');
      }
      const spells = JSON.parse(data);
      const spell = spells.find(s => s.id === parseInt(req.params.id));
      if (!spell) {
        return res.status(404).send('Spell not found.');
      }
      res.json(spell);
    });
  });

app.post('/api/spells', (req, res) => {
    fs.readFile(spellsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred while reading the spells file.');
        }
        const spells = JSON.parse(data);
        const newSpell = {
            id: spells.length > 0 ? Math.max(...spells.map(s => s.id)) + 1 : 1,
            ...req.body
        };
        spells.push(newSpell);
        fs.writeFile(spellsFilePath, JSON.stringify(spells, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while writing the spells file.');
            }
            res.status(201).json(newSpell);
        });
    });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    });
}

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
