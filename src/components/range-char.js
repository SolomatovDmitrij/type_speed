
export default function range_char(start_symbol, end_symbol){

    const start_code = start_symbol.charCodeAt(0);
    const end_code = end_symbol.charCodeAt(0);
    return Array.from({length: end_code - start_code + 1}, (value, index) => index + start_code)
        .map(x => String.fromCharCode(x));
}
