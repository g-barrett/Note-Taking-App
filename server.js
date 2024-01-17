const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.static('public'));



// getting notes.html at /notes path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});
// getting db info from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err,data) => {
    if (err) {
        throw err
    } 
    res.send(data);
    })
});

app.post('/api/notes', (req,res) => {
    const { title, text } = req.body;

    if (title && text ) {
    // saving object created for new notes 
    const newNote = {
        title,
        text,
        id: uuidv4(),
    };


    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        // write updated notes to file
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
        );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };

    res.status(201).json(response);
    } else {
    res.status(500).json('Error in posting note');
    }
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);