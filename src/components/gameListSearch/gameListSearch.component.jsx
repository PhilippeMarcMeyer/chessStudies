import React from 'react';
import './gameListSearch.styles.css';
import Select from '../utils/select.component';
import Checkbox from '../utils/checkbox.component';

const GameListSearch = (props) => {

        let selectedValue = props.knownOpenings.selected;
        let list = props.knownOpenings.list.map((x) => {
            return {"value":x,"text":x};
        });
        let selectedPlayer= props.knownPlayers.selected;
        let playersList = props.knownPlayers.list.map((x) => {
            return {"value":x,"text":x};
        });   
        let showLines = props.showLines;   
        return(
            <div className="game-search">
                 <Select changeHandler={props.onChangeOpening} list={list} selectedValue={selectedValue}/>   
                 <Select changeHandler={props.onChangePlayer} list={playersList} selectedValue={selectedPlayer}/>  
                 <div>
                    <label className={`chessStyle ${selectedValue === "all" ? "hidden" : ""}`}>
                    <Checkbox
                    className = 'check-box'
                        checked={showLines}
                        onChange={props.toggleShowLines}
                    />
                    <span>Show lines</span>
                    </label>
                </div> 
            </div>

        )

}

export default GameListSearch;