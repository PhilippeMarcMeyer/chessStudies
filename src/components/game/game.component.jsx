import React from 'react';
import './game.styles.css';
import Board from '../board/board.component';
import Info from '../info/info.component';

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
              "infos":"New Game",
              "pgnOn":false,
              "msg":"White to play",
              "data":[],
              "pgnHistory":"",
              "move":{"number":0,"side":"w"},
              "positions":[],
              "columns" : "a,b,c,d,e,f,g,h".split(","),
              "rows" : "1,2,3,4,5,6,7,8".split(","),
              "figures" : "R,N,B,Q,K,B,N,R".split(","),
              "pawn" : "p",
              "black": "B",
              "white": "W",
              "blackColor" : "dark-square",
              "whiteColor" : "light-square",
              "nrSquaresPerside" : 8, // in case we want to change the rules !!!
              "figCodes":{
                "KB":"&#9818;",
                "QB":"&#9819;",
                "RB":"&#9820;",
                "BB":"&#9821;",
                "NB":"&#9822;",
                "pB":"&#9823;",
                "KW":"&#9812;",
                "QW":"&#9813;",
                "RW":"&#9814;",
                "BW":"&#9815;",
                "NW":"&#9816;",
                "pW":"&#9817;",
              }
        };
        
      }
      UNSAFE_componentWillMount() {
        this.setNewGame();
      }

      savePGN = () => {
        let textArea = document.getElementById("game-input");
        if(textArea!=null){
          let pgn = textArea.value;
          if(pgn !== ""){ // todo check validity !
            localStorage.setItem("pgnHistory",pgn);
            this.setState({"pgnOn":true});
          }
        }
      }

      setNewGame = () => {
        let pgn = "";
        if(localStorage.getItem("pgnHistory")!== null){
          pgn = localStorage.getItem("pgnHistory");
        }

        let data = [];
        let positions =  [];
        let blackColor = this.state.blackColor;
        let whiteColor = this.state.whiteColor;
        let black =  this.state.black;
        let white =  this.state.white;

        var currentColor;
        var previousColor = whiteColor;
        var row = 0;
        let col = 0;
        var i = 0;
        for(var r = 7;r>=0;r--){
          row = this.state.rows[r];
          for(var c = 0;c<8;c++){
            col = this.state.columns[c];
            i++;
            if(i % 8 === 1){
              currentColor = previousColor;
            }else{
              currentColor = previousColor === blackColor? whiteColor : blackColor;
              previousColor = currentColor;
            }
            data.push({"row":row,"column":col,"squareColor":currentColor,"fig":null});
           }
        }
      
        this.state.figures.forEach((fig,i) =>{
          positions.push({"row":this.state.rows[0],"column":this.state.columns[i],"fig":fig+white});
          positions.push({"row":this.state.rows[1],"column":this.state.columns[i],"fig":this.state.pawn+white});
          positions.push({"row":this.state.rows[6],"column":this.state.columns[i],"fig":this.state.pawn+black});
          positions.push({"row":this.state.rows[7],"column":this.state.columns[i],"fig":fig+black});
        });

        data.forEach((sqr)=>{
            let check = positions.filter((pos)=>{
              return pos.row === sqr.row && pos.column === sqr.column;
            });
            if(check.length===1){
              sqr.fig = check[0].fig;
            }
        });

        this.setState((prevState,prevProps) => {
          return {
            "data": data,
            "positions":positions,
            "move":{"number":0,"side":"w"},
            "pgnHistory": pgn
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
            <Info key={1} game={this.state} savePGN={this.savePGN} ></Info>
          </div>
        </div>
      );
    }
  }
  export default Game;

