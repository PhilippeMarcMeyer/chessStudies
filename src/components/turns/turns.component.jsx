import React from 'react';
import './turns.styles.css';
const Turns = (props) => {
    return (
        <div className="game-turns">
            <ol>
                {
                    props.turnsList.map((turn, index) =>
                        <li key={index}>
                            <span onClick={props.movePGN} data-turn={index + 1} data-side="w"
                                className={`turn-w ${props.currentMove.number === index + 1 && props.currentMove.side === 'w' ? "turn-current" : ""}`}>
                                {turn.w}
                            </span>
                            <span onClick={props.movePGN} data-turn={index + 1} data-side="b"
                                className={`turn-b ${props.currentMove.number === index + 1 && props.currentMove.side === 'b' ? "turn-current" : ""}`}>
                                {turn.b}
                            </span>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default Turns;