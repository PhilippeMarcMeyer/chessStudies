import React from 'react';
import './game.styles.css';
import Board from '../board/board.component';

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
              "infos":"New Game",
              "msg":"White to play",
              "data":[],
              "move":{"number":0,"side":"w"},
              "positions":[],
              "columns" : "a,b,c,d,e,f,g,h".split(","),
              "rows" : "1,2,3,4,5,6,7,8".split(","),
              "figures" : "R,K,B,Q,K,B,K,R".split(","),
              "pawn" : "p",
              "black": "B",
              "white": "W",
              "blackColor" : "dark-square",
              "whiteColor" : "light-square",
              "nrSquaresPerside" : 8 // in case we want to change the rules !!!
        };
        this.setNewGame();
      }
      setNewGame = () => {
        let data = [];
        let positions =  [];
        let blackColor = this.state.blackColor;
        let whiteColor = this.state.whiteColor;
        let black =  this.state.black;
        let white =  this.state.white;

        let currentColor = blackColor;
        let i = 0;
        this.state.columns.forEach((col) =>{
          this.state.rows.forEach((row) =>{
            i++;
            currentColor = i % 2 === 1 ? blackColor : whiteColor;
            data.push({"row":row,"column":col,"squareColor":currentColor,"mob":null,"side":null});
          })
        })
  
        this.state.figures.forEach((fig,i) =>{
          positions.push({"row":this.state.rows[0],"column":this.state.columns[i],"mob":fig,"side":white});
          positions.push({"row":this.state.rows[1],"column":this.state.columns[i],"mob":this.state.pawn,"side":white});
          positions.push({"row":this.state.rows[6],"column":this.state.columns[i],"mob":this.state.pawn,"side":black});
          positions.push({"row":this.state.rows[7],"column":this.state.columns[i],"mob":fig,"side":white});
        });

        data.forEach((sqr)=>{
            let check = positions.filter((pos)=>{
              return pos.row === sqr.row && pos.column === sqr.column;
            });
            if(check.length===1){
              sqr.mob = check[0].mob;
              sqr.side = check[0].side;
            }
        });
        this.setState((prevState,prevProps) => {
          return {
            "data": data,
            "positions":positions,
            "move":{"number":0,"side":"w"}
           }
        });
      }
     
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board key={1} game={this.state} />
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

