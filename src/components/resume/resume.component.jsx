import React from 'react';
import './resume.styles.css';

const Resume = (props) => {
    return(
        <div className="game-resume">
            {props.resume.Date} {props.resume.White} vs {props.resume.Black} {props.resume.Result}          
        </div>
    )
}

export default Resume;