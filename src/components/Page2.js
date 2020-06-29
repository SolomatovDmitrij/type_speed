import React from 'react';
import range_char from './range-char';

const correct_char_array = range_char('A', '~') + range_char('!', '=') + " ";

function Page2() {

    async function handle_click_upload_text(e) {
        e.preventDefault();
        const elem = document.getElementById('inputNewText');
        console.log(elem);
        const new_text = Array.from(elem.value).filter( char1 => correct_char_array.includes(char1)).join('');

        const response = await fetch('http://192.168.0.210:3004/load_text',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    new_text: (new_text)
                })
            });
    }

    return (
        <div>
            <textarea id="inputNewText" name="new text" cols="30" rows="10"></textarea>
            <button onClick={handle_click_upload_text}>Загрузить текст в базу</button>
        </div>
    )
}

export default Page2;
