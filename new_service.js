// REPLACE OR SPLIT ON ANCIENT
const getAncientAndStrong = new RegExp(/\<.*?\>\s?(\[.*?\]\s?)+/gi);
// SPLIT VERSES
const splitVerses = new RegExp(/([\wáàâãéèêíïóôõöúçñ\-\,\.\;\:\?\(\)]\s?)+(\[\w{2,5}\])+\s*([\,\?\:\.\;])*/gi);
// SPLIT STRONGS
const getStrongs = new RegExp(/\[(\w{2,5})\]/gi);

function clearData (string) {
    return string.replace('<pb/>', '')
                    .replace(/\<S\>/g, '[')
                    .replace(/\<\/S\>/g, ']')
                    .replace(/\<n\>/g, '<')
                    .replace(/\<\/n\>/g, '>')
}

function removeFirstCharIfSpecial (string) {
    switch(string.charAt(0)) {
        case ';':
            return string.replace(';', '')
        default:
            return string;
    }
}

function getVerse(string) {
    return clearData(string)
                .replace(getAncientAndStrong, '')
                .match(splitVerses)
                .map(expression => {
                    expression = removeFirstCharIfSpecial(expression)
                    let strongs = expression.match(getStrongs);
                    if(strongs) {
                        strongs = strongs.map(strong => strong.replace(/[\[\]]/g, ''));
                    } else {
                        strongs = null;
                    }
                    let word = expression.replace(getStrongs, '')
                                            .replace(/\s*\,\s*/g, ',')
                                            .replace(/\s*\.\s*/g, '.')
                                            .replace(/\s*\-\s*/g, '-')
                                            .replace(/\s*\;\s*/g, ';')
                                            .replace(/\s*\?\s*/g, '?')
                                            .replace(/\s*\:\s*/g, ':')
                                            .trim();
                return { word, strongs };
            });
}

function getVerses(verses) {
    return verses.map(verse => ({ verse: verse.verse, text: getVerse(verse.text) }));
}

function clearStrong(definition) {
    return definition
                .replace(/\<nom\>/gi, '<sup>')
                .replace(/\<\/nom\>/gi, '</sup>')
                .replace(/\<ell\>/gi, '<i>')
                .replace(/\<\/ell\>/gi, '</i> - ')
}

module.exports = { getVerses, getVerse, clearStrong }