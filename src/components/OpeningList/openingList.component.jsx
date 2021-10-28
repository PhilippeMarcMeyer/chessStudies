
import React from 'react';
import './openingList.styles.css';

const OpeningList = (props) => {

    return (
        <div className={`opening-list ${!props.showLines  ? "hidden" : ""}`}>

        <span className="opening-list-length">#{props.lines.length}</span>
            <ol>
                { 
                    props.lines.map((line, index) =>
                        <li key={index}>
                            <div className="opening-list-element" >
                                {line.opening}<br/> {line.moves}
                            </div>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default OpeningList;