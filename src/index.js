//import {React, ReactDOM} from '../packages';
import React, { useState } from 'react';
import ReactDOM from 'reactDOM';


function App() {

    //const [name, setName] = useState('chi')

    return (
        <h1 title="foo">I am<span> chi</span></h1>
    )
}

function Test(){
    return (
        <h2>hi</h2>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))

