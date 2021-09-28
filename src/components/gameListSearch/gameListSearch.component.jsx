import React from 'react';
import './gameListSearch.styles.css';
import Select from '../utils/select.component';


const GameListSearch = (props) => {
    if(props.knownOpenings.list === null){
        return(
            <div className="game-search">
                &nbsp;
            </div>
        )
    }else{
        let selectedValue = props.knownOpenings.selected;
        let list = props.knownOpenings.list.map((x) => {
            return {"value":x,"text":x};
        });
        return(
            <div className="game-search">
                 <Select changeHandler={props.onChangeOpening} list={list} selectedValue={selectedValue}/>   
            </div>
        )
    }

}

export default GameListSearch;