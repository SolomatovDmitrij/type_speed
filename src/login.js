import React, { useContext } from 'react';
import UserContext from './user-context';

function Login() {
    const {user, set_user} = useContext(UserContext)
    //1. reducer
    const [state, setState] = React.useReducer( (s, a) => ({...s, ...a}), {
        resolved: false,
        loading: false,
        error: null,
    } )
    //2. обработка submit
    function handleSubmit(event) {
        event.preventDefault()
        const { usernameInput, passwordInput } = event.target.elements
        setState({ resolved: false, loading: true, error: null })
        //вызывем метод fetch
        window.fetch('http://147.78.66.199/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    id: "",
                    name: usernameInput.value,
                    password: passwordInput.value,
                }
            )
        } )
        .then( response => {
            if(response.ok) {
                return response.json()
            } else {
                throw new TypeError(response.statusText)
            }
        } )
        //.then( r => r.json() )
        //сохраняем результат возврата если пользователь зашел
        .then( user => {
            console.log(user)
            setState( {loading: false, resolved: true, error: null} )
            localStorage.setItem('user', JSON.stringify(user))
            set_user(user)

        })
        .catch(
            error => {
                //console.log(error)
                setState( {loading: false, resolved: false, error: error.message} )
                //window.localStorage.removeItem('token')
            }
        )
    }
    //3. отрисовка формы
    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="usernameInput">Username</label>
                <input id="usernameInput" />
            </div>
            <div>
                <label htmlFor="passwordInput">Password</label>
                <input id="passwordInput" type="password" />
            </div>
            <button type="submit">Submit{ state.loading ? '...' : null }</button>
        </form>
        { state.error ? <div role="alert">{ state.error }</div> : null }
        { state.resolved ? (<div role="alert">Congrats! You are signed in!</div>) : null }
        </div>
    )
}
export default Login;
