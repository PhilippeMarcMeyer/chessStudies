import React from 'react';
import './movesCommands.styles.css';

const MovesCommands = (props) => {
    return (
        <div className="moves-board">
            <span data-move="first" onClick={props.movePGN} >&#9198;</span>
            <span data-move="prev" onClick={props.movePGN} >&#9204;</span>
            <span data-move="pause" className="hidden" onClick={props.movePGN} >&#9208;</span>
            <span data-move="next" onClick={props.movePGN} >&#9205;</span>
            <span data-move="last" onClick={props.movePGN} >&#9197;</span>
        </div>
    )
}

export default MovesCommands;