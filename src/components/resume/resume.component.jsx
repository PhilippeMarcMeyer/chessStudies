import React from 'react';
import './resume.styles.css';

const Resume = (props) => {
    console.log(props.resume);
    return(
        <div className="game-resume">
            <div>{props.resume.Date}</div>
            <div>{props.resume.White} vs {props.resume.Black}</div>
            <div>{props.resume.Result}</div>               
        </div>
    )
}

export default Resume;