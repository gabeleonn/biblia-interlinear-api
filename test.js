const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const { getVerse, clearStrong } = require('./new_service');

let db = new sqlite3.Database('./data/database.SQLite3', (err) => {
    if(err) {
        console.log(err)
    }
});

const info = {
    version: 'Almeida Revista e Atualizada com Strongs',
	shortVersion: 'ARA+',
	copyright: 'Almeida Revista e Atualizada© Copyright © 1993 Sociedade Bíblica do Brasil. Todos os direitos reservados. Texto bíblico utilizado com autorização. Saiba mais sobre a Sociedade Bíblica do Brasil www.sbb.org.br. A Sociedade Bíblica do Brasil trabalha para que a Bíblia esteja, efetivamente, ao alcance de todos e seja lida por todos. A SBB é uma entidade sem fins lucrativos, dedicada a promover o desenvolvimento integral do ser humano. Você também pode ajudar a Causa da Bíblia!',
}

const getStrongs = (number) => {

    db.all(`SELECT *  FROM strongs ORDER BY topic;`, (err, data) => {
        if (err) throw err;
        let output = data.map(strong => {
            strong.definition = clearStrong(strong.definition);
            return strong;
        });

        fs.writeFile('./next/strongs.json', JSON.stringify(output), (err) => err ? err : '');
    })
};

const getBooks = () => {
    db.all(`SELECT *  FROM verses AS v JOIN books AS b ON b.book_number = v.book_number ORDER BY b.book_number, v.chapter, v.verse;`, (err, data) => {
        if (err) throw err;
        let output = data.map(verse => {
            verse.text = getVerse(verse.text);
            return verse;
        });

        fs.writeFile('./next/books.json', JSON.stringify(output), (err) => err ? err : '');
    });

    
};

//getBooks()
getStrongs();