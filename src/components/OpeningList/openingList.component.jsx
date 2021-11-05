
import React from 'react';
import './openingList.styles.css';

const OpeningList = (props) => {
    props.lines.sort((a,b)=>{
        if(a.moves === b.moves){
            return a.moves.length - b.moves.length;
        }else{
            return a.moves - b.moves;
        }
    })
    return (
        <div className={`opening-list ${!props.showLines  ? "hidden" : ""}`}>

        <span className="opening-list-length">#{props.lines.length}</span>
            <ol>
                { 
                    props.lines.map((line, index) =>
                        <li key={index}>
                            <div className="opening-list-element" >
                                {line.opening}<br/> {line.moves}
                                <span className="button choose" data-moves={line.moves} data-name={line.opening} data-fen={line.fen} onClick={props.loadLine}></span>
                            </div>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default OpeningList;