
import React,{Component} from 'react';

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
          boards: [
              {"infos":""},
              {"data":null},
              {"move":{"number":1,"side":"w"}},
              {"positions":[]}
            ],
        };
      }
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  export default Game;
