import React from 'react';
import './turns.styles.css';

const Turns = (props) => {
    return(
        <div className="game-turns">
            <ol>
                {
                    props.turnsList.map((turn, index) => 
                        <li key={index}>
                            <span onClick={props.movePGN} data-turn={index+1} data-side="w" className="turn-w">{turn.w}</span>
                            <span onClick={props.movePGN} data-turn={index+1} data-side="b" className="turn-b">{turn.b}</span>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default Turns;