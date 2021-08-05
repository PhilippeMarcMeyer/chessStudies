import React from 'react';
import './board.styles.css';

class Board extends React.Component {

    renderSquare(i) {
     // return <Square />;
    }
  
    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
   
          </div>
          <div className="board-row">

          </div>
          <div className="board-row">

          </div>
        </div>
      );
    }
  }
  export default Board;