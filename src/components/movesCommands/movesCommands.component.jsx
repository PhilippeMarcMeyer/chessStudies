import React from 'react';
import './movesCommands.styles.css';
import prev from '../../assets/prev.gif';
import next from '../../assets/next.gif';
import first from '../../assets/first.gif';
import last from '../../assets/last.gif';
const MovesCommands = (props) => {
    return (
        <div className="moves-board">
            <span data-move="first" onClick={props.movePGN} ><img src={first} className="command-img" alt="first" /></span>           
            <span data-move="prev" onClick={props.movePGN} ><img src={prev} className="command-img" alt="prev" /></span>
            <span data-move="pause" className="hidden" onClick={props.movePGN} >&#9208;</span>
            <span data-move="next" onClick={props.movePGN} ><img src={next} className="command-img" alt="next" /></span>
            <span data-move="last" onClick={props.movePGN} ><img src={last} className="command-img" alt="last" /></span>
        </div>
    )
}
export default MovesCommands;