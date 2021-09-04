import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    return (
        <div className="game-list">
            <ol>
                { 
                    props.games.map((game, index) =>
                        <li key={index} onClick={props.loadGame}>
                          {game.pgnResume.Event} {game.pgnResume.Site} <br/>
                          {game.pgnResume.White} {"vs"} {game.pgnResume.Black} {"=>"} {game.pgnResume.Result}
                          <span className="button">Load</span>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;