let text = "<pb/>No princípio, <S>7225</S> criou <S>1254</S> <S>8804</S> <S>853</S> Deus <S>430</S> os céus <S>8064</S> e <S>853</S> a terra. <S>776</S>"

let two = "<pb/>José <S>3130</S> foi levado <S>3381</S> <S>8717</S> ao Egito, <S>4714</S> e Potifar, <S>6318</S> oficial <S>5631</S> de Faraó, <S>6547</S> comandante <S>8269</S> da guarda, <S>2876</S> egípcio, <S>376</S> <S>4713</S> comprou-o <S>7069</S> <S>8799</S> dos <S>3027</S> ismaelitas <S>3459</S> que o tinham levado <S>3381</S> <S>8689</S> para lá."

function clearData (string) {
    return string.replace('<pb/>', '')
                    .replace(/\<S\>/g, '[')
                    .replace(/\<\/S\>/g, ']')
                    .replace(/\<n\>/g, '<')
                    .replace(/\<\/n\>/g, '>')
}

function getSubVerses (string) {
    return clearData(string).match(/([\wáàâãéèêíïóôõöúçñ\-\,\.\;]\s*)+\s?(\[.*?\]+\s?)+/g);
}

console.log(clearData(two))