function clearData (string) {
    return string.replace('<pb/>', '')
                    .replace(/\<S\>/g, '[')
                    .replace(/\<\/S\>/g, ']')
                    .replace(/\<n\>/g, '<')
                    .replace(/\<\/n\>/g, '>')
}

function getSubVerses (string) {
    return clearData(string).match(/([\wáàâãéèêíïóôõöúçñ\-\,\.\;\:\?]\s?)+(\[.*?\])+\s?(\<.*?\>\s?(\[.*?\][\s\.\,\;\-\:\?]?)+)+[\.\,\-\;\:\?]*/gi);
}

function getAncientWithStrong (string) {
    const regex = new RegExp(/\<.*?\>\s?(\[.*?\]\s?)+/gi);
    return string.match(regex);
}

function getAncient (string) {
    return clearStrongs(string).replace(/[\<\>]/g, '').replace(' ', '');
}

function getAncientObject (array) {
    const strongs = []
    array.map(item => strongs.push(...getStrongs(item)));
    const [ word ] = array.map(item => getAncient(item));
    return { word, strongs }
}

function getActualWithStrong (string) {
    const ancient = new RegExp(/(\<.*?\>\s?(\[.*?\]\s?)+)+/gi);
    string = string.replace(ancient, '')
    const regex = new RegExp(/([\wáàâãéèêíïóôõöúçñ\-\,\.\;\:\?]\s?)+(\[\w*\])+[\.\,\-\;\:\?]?([\s\.\,\-\;\:\?])*/gi);
    return string.match(regex);
}

function getActual (word) {
    word = clearStrongs(word);
    return word.replace(/\s*\,\s*/g, ',')
                        .replace(/\s*\.\s*/g, '.')
                        .replace(/\s*\-\s*/g, '-')
                        .replace(/\s*\;\s*/g, ';')
                        .replace(/\s*\;\s*/g, ';')
                        .replace(/\s*\:\s*/g, ':')
                        .trim();
}

function getActualObject(array) {
    const strongs = []
    array.map(item => strongs.push(...getStrongs(item)));
    const [ word ] = array.map(item => getActual(item));
    return { word, strongs }
}

function getStrongs (string) {
    const regex = new RegExp(/\[(\w*)\]/gi);
    let result = string.match(regex).map(strong => strong.replace(/[\[\]]/g, ''));
    return result;
}

function clearStrongs (string) {
    return string.replace(/\[\w.*\]/g, '');
}

function getAncientAndActual(string) {
    return [getAncientWithStrong(string), getActualWithStrong(string)];
}

function getVerseAsJson(verse) {
    const subVerses = getSubVerses(verse);
    return subVerses.map(subverse => {
        let [ancient, actual] = getAncientAndActual(subverse);
        return { ...getActualObject(actual) }
    })
}

function getVersesAsJson(verses) {
    return verses.map(verse => ({ verse: verse.verse, text: getVerseAsJson(verse.text) }));
}

module.exports = { getVersesAsJson }