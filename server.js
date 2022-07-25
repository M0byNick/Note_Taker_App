const express = require('express');
const path = require('path');
const app = express();

const fs = require('fs');

const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const PORT = 3001;

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    readFile('db.json', 'utf8').then(rawNotes => {
        var newNotes;
        try {
            newNotes = [].concat(JSON.parse(rawNotes))
        } catch (error) {
            newNotes = [];
        }
        return newNotes;
    }).then(notesResponse => res.json(notesResponse))
});

app.post('/api/notes', (req, res) => {
    readFile('db.json', 'utf8').then(rawNotes => {
        var newNotes;
        try {
            newNotes = [].concat(JSON.parse(rawNotes))
        } catch (error) {
            newNotes = [];
        }
        return newNotes;
    }).then(oldNotes => {
        var newNoteObj = {
            title: req.body.title, text: req.body.text
        }
        var newNotesArray = [...oldNotes, newNoteObj]
        return newNotesArray;
    }).then(newNotesArray2 => {
        writeFile('db.json', JSON.stringify(newNotesArray2));
    }).then(newNotesResponse => {
        res.json({
            msg: 'A-okay'
        })
    })
})

app.listen(PORT, () => {
    console.log(`Example Notes listening at http://localhost:${PORT}`);
});