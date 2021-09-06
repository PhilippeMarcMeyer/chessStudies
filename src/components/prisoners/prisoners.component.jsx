import React from 'react';
import './prisoners.styles.css';

function createReverseSign() {
    return {__html: '&UpArrowDownArrow;'};
  }

const Prisoners = (props) => {
    return (
        <div className={`jail ${props.boardPosition === "inversed" ? "reverse" : ""} 
        ${props.side === "b" ? (props.boardPosition === "inversed" ? "black" : "white") : (props.boardPosition === "inversed" ? "white" : "black")}`}>
            <span className="jail-yard"></span>
            <span className="inverse-clickable" onClick={props.reverseBoard} dangerouslySetInnerHTML={createReverseSign()}/>
        </div>
    )
}
export default Prisoners;

