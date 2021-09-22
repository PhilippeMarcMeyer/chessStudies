import React from 'react';
import './analysis.styles.css';

const Analysis = (props) => {
    return (
        <div className='analysis-zone'>
            <h3 className='analysis-title'>{props.analysis ? props.analysis.title:""}</h3>
            <p className='analysis-text'>{props.analysis ? props.analysis.text:""}</p>
            <div className='analysis-moves'>{props.analysis ? props.analysis.moves:""}</div>
        </div>
    )
}

export default Analysis;