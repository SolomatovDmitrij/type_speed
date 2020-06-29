import React, {useContext, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Tabs from './components/Tabs';
import Login from './login'
import UserContext from './user-context';

function App() {
    const  [user, set_user] = useState(JSON.parse(localStorage.getItem('user')))
    const root = user ? <Tabs /> : <Login />
    return (
        <UserContext.Provider value={{user, set_user}} >
            <h1>Test print {user ? "for " + user.name : ""}</h1>
            {root}
        </UserContext.Provider>
    )
}

export default App;
