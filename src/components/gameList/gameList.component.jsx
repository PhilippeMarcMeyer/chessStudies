import React from 'react';
import './gameList.styles.css';
const GameList = (props) => {
    let selectedOpening = props.knownOpenings && props.knownOpenings.selected ? props.knownOpenings.selected : "all";
    let selectedPlayer = props.knownPlayers && props.knownPlayers.selected ? props.knownPlayers.selected : "all";

    let games = props.games;
    if(selectedOpening !== "all"){
        games = games.filter((x) => {
            return "opening" in x.pgnResume && x.pgnResume.opening.indexOf(selectedOpening) !==-1;
        })
    }
    if(selectedPlayer !== "all"){
        games = games.filter((x) => {
            if("White" in x.pgnResume && x.pgnResume.White === selectedPlayer){
                return true;
            }else if("Black" in x.pgnResume && x.pgnResume.Black === selectedPlayer){
                return true;
            }else{
                return false;
            }
        })
    }
    return (
        <div className="game-list">
            <ol>
                { 
                    games.map((game, index) =>
                        <li key={index}>
                            <div className="list-element" >
                                <span className="list-element-text" >
                                {game.pgnResume.Event} {game.pgnResume.Site} {game.pgnResume.Date} <br/>
                                {game.pgnResume.White} {"vs"} {game.pgnResume.Black} {"=>"} {game.pgnResume.Result} <br/>
                                {"White elo : "}{game.pgnResume.WhiteElo} {"Black elo : "} {game.pgnResume.BlackElo} <br/>
                                {"Opening : "} {game.pgnResume.opening} {" "} {game.pgnResume.openingMoves} <br/>
                                </span>
                                <span className="button choose" data-index={game.id} onClick={props.loadGame}></span>
                                <span className={`button delete ${!props.online  ? "hidden" : ""}`} data-index={game.id} onClick={props.deleteGame}></span>
                            </div>
                        </li>
                    )
                }
            </ol>
        </div>
    )
}

export default GameList;