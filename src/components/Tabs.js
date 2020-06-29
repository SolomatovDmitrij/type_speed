import React, {useState} from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import './Tabs.css';

function Tab() {
    const [tabIndex, setTabIndex] = useState(1);

    let page;

    if(tabIndex===1) page = <Page1 /> 
        else if(tabIndex===2) page = <Page2 /> 
    else if(tabIndex==3) page = <Page3 />;

    return (
        <div>
            <nav className='navbar'>
                <button className='navbar_button' onClick={() => setTabIndex(1)}>Type</button>
                <button className='navbar_button' onClick={() => setTabIndex(2)}>Load</button>
                <button className='navbar_button' onClick={() => setTabIndex(3)}>Results</button>
            </nav>
            <div className='page'>
                {page}
            </div>
        </div>
    )
}

export default Tab;
