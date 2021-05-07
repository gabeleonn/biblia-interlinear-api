const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const { getVerses, clearStrong } = require('./new_service');

let db = new sqlite3.Database('./data/database.SQLite3', (err) => {
    if(err) {
        console.log(err)
    }
});

const app = express();

app.use(express.json());
app.use(cors())

const info = {
    version: 'Almeida Revista e Atualizada com Strongs',
	shortVersion: 'ARA+',
	copyright: 'Almeida Revista e Atualizada© Copyright © 1993 Sociedade Bíblica do Brasil. Todos os direitos reservados. Texto bíblico utilizado com autorização. Saiba mais sobre a Sociedade Bíblica do Brasil www.sbb.org.br. A Sociedade Bíblica do Brasil trabalha para que a Bíblia esteja, efetivamente, ao alcance de todos e seja lida por todos. A SBB é uma entidade sem fins lucrativos, dedicada a promover o desenvolvimento integral do ser humano. Você também pode ajudar a Causa da Bíblia!',
}

app.get('/ara/:book/:chapter', (req, res) => {
    const { book, chapter } = req.params;

    db.all(`SELECT b.long_name AS book, b.short_name AS bookLink, v.verse, v.text, b.chapters  FROM verses AS v JOIN books AS b ON b.book_number = v.book_number WHERE b.short_name = '${book.toLowerCase()}' AND v.chapter = '${chapter}' ORDER BY v.verse;`, (err, data) => {
        if(err || data.length === 0) {
            return res.status(404).json({ message: err})
        }
        return res.json({ ...info, book: data[0].book, bookLink: data[0].bookLink, chapter: parseInt(chapter), chapters: data[0].chapters, verses: getVerses(data) })
    })
});

app.get('/strong/:number', (req, res) => {
    const { number } = req.params;
    db.all(`SELECT *  FROM strongs WHERE topic = '${number}';`, (err, data) => {
        if(err || data.length === 0) {
            return res.status(404).json({ message: 'Error'})
        }
        data = { ...data[0] }
        return res.json({ definition: clearStrong(data.definition) })
    })
});

app.get('/paths', (req, res) => {
    db.all(`SELECT b.short_name AS book, v.chapter AS chapter  FROM verses AS v JOIN books AS b ON b.book_number = v.book_number;`, (err, data) => {
        if(err) {
            console.log(err)
            return res.status(404).send()
        }
        data = data.map(item => ({ book: item.book, chapter: item.chapter.toString() }))
        return res.json(data);
    })
})

const PORT = process.env.PORT || 8000;

app.listen(PORT);
