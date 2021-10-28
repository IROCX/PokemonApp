// import React, { useState } from 'react';
import './style.css'

function Snackbar({text, type}) {

    return (
        <div id="snackbar" className={`snackbar ${type}`}>
            <div>{text}</div>
        </div>

    );
}

export default Snackbar;