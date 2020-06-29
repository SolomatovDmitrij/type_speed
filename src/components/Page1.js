import React, {useState, useContext, useRef, useEffect} from 'react'
import './Page1.css';
import axios from 'axios';
import UserContext from '../user-context';
import range_char from './range-char';

const axios2 = require('axios');
const correct_char_array = range_char('A', '~') + range_char('!', '=') + " ";


function ErrorCounter(props){
    return <p>Количество ошибок: {props.errors}</p> ;
}

function PrintedText(props) {
    return( 
        <div>
        <span className="black_style">
        {props.text1}
        </span>

        <span>
        {props.text2}
        </span>
        </div>
    )
}

function Page1() {
    async function get_data_from_backend() {
        //get data from backend
        let result = await fetch('http://192.168.0.210:3004/text')
            .then((response)=>response.json())
            .then( text => {return {
                text1: '',
                text2: text,
                error_count: 0,
            };});
        return result;
    };

    const [state, setState] = useState({
        text1: '',
        text2: {text: 'wait...'},
        error_count: 0,
        is_error: false,
        error_name: ''
    });

    const {user} = useContext(UserContext)

    const state_ref = useRef(state);

    const [start_time, set_start_time] = useState(null);
//    const [is_error, set_is_error] = useState(false);
    const [key_function, set_key_function] = useState(
        {func:
            function key_down_handler({key}) {
                const cur_state = state_ref.current;

                if(correct_char_array.includes(key)){
                    //console.log(cur_state.text1);
                    if(!cur_state.text1) {
                        const date1 = Date.now();
                        set_start_time(date1);
//                        console.log(date1);
                    };

                    if(key===cur_state.text2.text.substring(0,1)){
                        setState({
                            text1: cur_state.text1 + key,
                            text2: {text: cur_state.text2.text.substring(1), _id: cur_state.text2._id},
                            error_count: cur_state.error_count,
                            is_error: false,
                        });

                    } else {
                        setState({
                            text1: cur_state.text1,
                            text2: cur_state.text2,
                            error_count: cur_state.error_count + 1,
                            is_error: true,
                            error_name: cur_state.error_name==='error1' ? 'error2' : 'error1',
                        });
                    }
                } 
            }}
    );

    useEffect( () => {

        const initialState = get_data_from_backend();
        initialState.then(x => setState(x));

        console.log('add event listener') ;
        document.addEventListener("keydown",  key_function.func );

        return () => {
            console.log('remove event listener1');
            document.removeEventListener("keydown", key_function.func)};

    }, []);

    //если нечего набирать, тогда сохраняем результат
    useEffect (() => {

        state_ref.current = state;
        if(state.text2.text.length == 0){
            const date2 = Date.now();
            console.log(start_time);
            console.log('remove event listener');
            document.removeEventListener("keydown", key_function.func);

            const time_typed = (date2 - start_time)/1000;
            const speed = Math.floor(state.text1.length * 60 / time_typed);
            alert('The game is over! speed: ' + speed);
            save_result_get(speed, Math.floor(state.error_count/state.text1.length*1000), state.text2._id.$oid);
        }
    });
    function save_result_get(speed, error, text_id) {
        axios.get('http://192.168.0.210:3004/save_result_get?speed=' + speed + '&error=' + error 
            + '&user_id=' + user.id + '&text_id=' + text_id );
    }

    return (
        <div className='text_print' style={state.is_error ? {animation: state.error_name + ' 1s'} : null}>
        <ErrorCounter errors={state.error_count} />
        <PrintedText text1={ state.text1 } text2={ state.text2.text } />
        </div>
    )
}

export default Page1;
