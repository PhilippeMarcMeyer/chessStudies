import React from 'react';
import './gameMenu.styles.css';

const GameMenu = (props) => {
    return (
        <div className="game-menu">
            <div data-target="showMoves" className={`${props.movesLoaded ? "" : "hidden"}`} onClick={props.menuMove}>Moves</div>           
            <div data-target="showList" onClick={props.menuMove}>Games list</div>           
            <div data-target="showInput" onClick={props.menuMove}>New game</div>           
        </div>
    )
}

export default GameMenu;
