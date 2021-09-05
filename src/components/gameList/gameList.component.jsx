import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    return (
        <div className="game-list">
            <ol>
                { 
                    props.games.map((game, index) =>
                        <li key={index}>
                          {game.pgnResume.Event} {game.pgnResume.Site} <br/>
                          {game.pgnResume.White} {"vs"} {game.pgnResume.Black} {"=>"} {game.pgnResume.Result}
                          <span className="button" data-index={index} onClick={props.loadGame}>Load</span>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;