import React from 'react';
import './game.styles.css';
import Board from '../board/board.component';
import Info from '../info/info.component';
import {getMoveOffset,getAskedMove,getNextMove} from '../../movesLogic.js';

class Game extends React.Component {
    constructor(){
        super();        
         // off, loaded, inerror, ready
        this.gameStatus = {
            "off":0,
            "loaded":1,
            "inerror":2,
            "ready":3
        };

        this.state = {
              "gameIsReady" :false,
              "status":this.gameStatus.off,
              "infosTitle":"",
              "infosMessage":"",
              "msg":"White to play",
              "data":[],
              "pgnHistory":"",
              "move":{"number":0,"side":"b"},
              "pgnResume":[],
              "pgnGame":[],
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

     moveGameTo = (askedMove) => {
        let currentMove = this.state.move;
        let gamePositions = this.state.pgnGame;
        let nextMoveData = getNextMove (gamePositions,currentMove,askedMove);
        if(!nextMoveData.isError){
          if(nextMoveData.moveType === "move"){
            if(nextMoveData.possiblePositions && nextMoveData.possiblePositions.length > 0){
                for(let i = 0;i< nextMoveData.possiblePositions.length; i++){
                  
                }
            }
          }
        }
        console.log(nextMoveData);
    }

    componentDidMount() {
      this.setNewGame();
    }

      cleanRawInfo = (raw) => {
        //[Event \"Live Chess\"]
        let clean = raw.replace(/\\|[|]|"/g, "");
        let pos = clean.indexOf(" ");
        if(pos !== -1){
          let key = clean.substring(0,pos-1);
          let value = clean.substring(pos+1,clean.length);
          let result = {};
          result[key] = value;
          return result;
        }else return null;
      }

      movePGN= (e) => {
        let elem = e.currentTarget;

        let askedMove= getAskedMove(elem);
        let askedMoveOffset = getMoveOffset(askedMove);
        let currentMove = this.state.move;
        let currentMoveOffset = getMoveOffset(currentMove);

        if(askedMoveOffset !== currentMoveOffset){
          if(askedMoveOffset > currentMoveOffset){
          // move from currentMove to askedMove
          this.moveGameTo(askedMove);
          }else{
            // reset currentMove to 0 and move to askedMove
            this.setState((prevState,prevProps) => {
              return {
                "move":{"number":0,"side":"w"}
               }
            },() => {
              this.moveGameTo(askedMove);
            });
          }
        }
      }

      savePGN = () => {
        let textArea = document.getElementById("game-input");
        if(textArea!=null){
          let pgn = textArea.value;
          if(pgn !== ""){ // todo check validity !
            localStorage.setItem("pgnHistory",pgn);
            this.setState((prevState,prevProps) => {
              return {
                "status": this.gameStatus.loaded,
               }
            },() => {
              this.setGameInfos();
              let turns = [];
              let turn = 1;
              let limitBetweenGameParts =/\n\n/.exec(pgn).index;
              let pgnGame = pgn.substring(limitBetweenGameParts, pgn.length).replace(/\r\n?|\n/g, " ").trim();
              let infos = pgn.substring(0, limitBetweenGameParts).replace(/\r\n?|\n/g, ",").trim().split(",");
              let turnPrevPosition =  pgnGame.indexOf(turn+".");
              let turnNextPosition = 0;
              let currentTurnData;
              let end;
              while (turnPrevPosition !== -1 && turnNextPosition !== -1){
                turnNextPosition =  pgnGame.indexOf((turn+1)+".");
                if(turnNextPosition !==-1){
                  end = turnNextPosition;
                }else{
                  end = turnPrevPosition + 100;
                }
                  currentTurnData = pgnGame.substring(turnPrevPosition, end).replace(turn+".","").trim();
                  let moves = currentTurnData.split(" ");
                  let turnInfo = {"w":moves[0]};
                  if(moves.length === 2){
                    turnInfo.b = moves[1];
                  }
                  turns.push(turnInfo);
                  turnPrevPosition = turnNextPosition;
                turn++;
              } 
              let infosClean = {};
              infos.forEach(function(raw){
                let clean = raw.replace(/\\|\[|\]|"/g, "");
                let pos = clean.indexOf(" ");
                if(pos !== -1){
                  let key = clean.substring(0,pos);
                  let value = clean.substring(pos+1,clean.length);
                  infosClean[key] = value;
                }
              });
              this.setState((prevState,prevProps) => {
                return {
                  "pgnResume": infosClean,
                  "pgnGame":turns,
                  "status": this.gameStatus.ready
                 }
              },() => {
                this.setGameInfos();
              });
            });
          }
        }
      }

      setGameInfos = () => {
        let infos = ""
        switch (this.state.status) {
          case this.gameStatus.off:
            infos = {"title":"Please enter a game in PGN format","message":""};
            break;
          case this.gameStatus.loaded:
            infos = {"title":"Game loaded","message":"analysing game...(WIP)"};
           break;
           case this.gameStatus.inerror:
            infos = {"title":"Error !","message":"the game can't be analysed..."};
           break;
           case this.gameStatus.ready:
            infos = {"title":"Game ready","message":"Let's read it !"};
           break;
          default:
            infos = {"title":"Error !","message":"the program is in error..."};
        }

        this.setState((prevState,prevProps) => {
          return {
            "infosTitle":infos.title,
            "infosMessage":infos.message
           }
        });
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
            "pgnHistory": pgn,
            "gameIsReady":true
           }
        });
        
      }

        render() {
          if( this.state.gameIsReady){
          return (
            <div className="game">
              <div className="game-board">
                <Board key={1} game={this.state} />
              </div>
              <div className="game-info">
                <Info key={1} game={this.state} movePGN={this.movePGN} savePGN={this.savePGN} statuses={this.gameStatus}></Info>
              </div>
            </div>
          );
          }else{
            return(
              <div className="game">
                <h1> Loading </h1>
              </div>
            );
          }
        }
  }

  export default Game;

