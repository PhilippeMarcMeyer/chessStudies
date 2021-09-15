import React from 'react';
import './game.styles.css';
import Board from '../board/board.component';
import Info from '../info/info.component';
import { getAskedMove, getNextMove, pngToTurns, pngToInfos, getMoveDataAt, getPositionsAt ,boardToScore} from '../../movesLogic.js';
import { boardToFen, fenToBoard } from '../../fen.js';

class Game extends React.Component {
  constructor() {
    super();
    this.gameStatus = {
      "init": 0,
      "showList": 1,
      "showInput": 2,
      "showMoves": 3,
      "showMessage": 4,
      "inError": -1,
    };

    this.state = {
      "database": null,
      "games": [],
      "scores" : {
        "whiteScore" : 0,
        "blackScore" : 0,
        "whiteJail" : [],
        "blackJail" : []
      },
      "gameKey": 0,
      "doReverseBoard" :false,
      "proposeSave": false,
      "status": this.gameStatus.init,
      "readerStop": false,
      "initialData": null,
      "gameIsReady": false,
      "infosTitle": "",
      "infosMessage": "",
      "msg": "White to play",
      "data": [],
      "pgnHistory": "",
      "move": { "number": 0, "side": "b" },
      "pgnResume": [],
      "pgnGame": [],
      "fenGame": [{ "number": 0, "side": "w", "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }],
      "positions": [],
      "columns": "a,b,c,d,e,f,g,h".split(","), // "columns" or "files"
      "rows": [1, 2, 3, 4, 5, 6, 7, 8],
      "figures": "R,N,B,Q,K,B,N,R".split(","),
      "pawn": "p",
      "black": "B",
      "white": "W",
      "blackColor": "dark-square",
      "whiteColor": "light-square",
      "nrSquaresPerside": 8, // in case we want to change the rules !!!
      "figCodes": {
        "KB": "&#9818;",
        "QB": "&#9819;",
        "RB": "&#9820;",
        "BB": "&#9821;",
        "NB": "&#9822;",
        "pB": "&#9823;",
        "KW": "&#9812;",
        "QW": "&#9813;",
        "RW": "&#9814;",
        "BW": "&#9815;",
        "NW": "&#9816;",
        "pW": "&#9817;",
      }
    };
  }

  reverseBoard= (e) => {
    let doReverse= !this.state.doReverseBoard;
    this.setState((state, props) => (
      {
        "doReverseBoard": doReverse,
      }
    ));
  }

  deleteGame= (e) => {
    let index = e.currentTarget.getAttribute("data-index");
    if (this.state.games && this.state.games.length > 0 && index < this.state.games.length) {
      this.doDeleteGame(index);
    }
  }

  loadGame = (e) => {
    let index = e.currentTarget.getAttribute("data-index");
    if (this.state.games && this.state.games.length > 0 && index < this.state.games.length) {
      this.doLoadGame(index);
    }
  }

  doDeleteGame = (index) => {
    let games = JSON.parse(JSON.stringify(this.state.games));
    games.splice(index, 1);
    let otherProps = {
      games : games
    }
    localStorage.setItem("games", JSON.stringify(games));
    let newStatus = games && games.length > 0 ? this.gameStatus.showList: this.gameStatus.showInput;
    this.setGameStatus(newStatus, "", otherProps);
  }

  doLoadGame = (index) => {
    let game = this.state.games[index];
    let otherProps = {
      "data": JSON.parse(this.state.initialData),
      "pgnResume": game.pgnResume,
      "pgnHistory": game.pgnHistory,
      "pgnGame": game.pgnGame,
      "fenGame": game.fenGame,
      "move": {
        "number": 0,
        "side": "w"
      },
      "scores" : {
        "whiteScore" : 0,
        "blackScore" : 0,
        "whiteJail" : [],
        "blackJail" : []
      }
    }
    this.setGameStatus(this.gameStatus.showMoves, "", otherProps);
  }

  moveGameTo = (askedMove) => {
    let timing = 10;
    if ("pace" in askedMove) {
      if (askedMove.pace === "quick") {
        timing = 1;
      }
    }
    let currentMove = this.state.move;
    let gamePgn = this.state.pgnGame;
    let gamePositions = this.state.data;
    let columnsOrdered = this.state.columns.slice(0)
    let nextMoveData = getNextMove(gamePgn, currentMove, askedMove, columnsOrdered);

    if (!nextMoveData.isError && !nextMoveData.isDone) {
      let hasMoved = false;
      if (nextMoveData.possiblePositions && nextMoveData.possiblePositions.length > 0) {
        for (let i = 0; i < nextMoveData.possiblePositions.length; i++) {
          if (hasMoved) break;
          for (let j = 0; j < gamePositions.length; j++) {
            if (gamePositions[j].column === nextMoveData.possiblePositions[i].column && gamePositions[j].row === nextMoveData.possiblePositions[i].row) {
              if (gamePositions[j].fig === (nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase())) {
                hasMoved = true;
                gamePositions[j].fig = null;
                break;
              }
            }
          }
        }

        if (nextMoveData.additionalMove !== null) {
          let hasMovedKing = hasMoved;
          let hasMovedRook = false;
          for (let i = 0; i < gamePositions.length; i++) {
            // Rook
            if (gamePositions[i].column === nextMoveData.additionalMove.possiblePositions[0].column && gamePositions[i].row === nextMoveData.additionalMove.possiblePositions[0].row) {
              if (gamePositions[i].fig === nextMoveData.additionalMove.movePieceType + nextMoveData.additionalMove.moveSide.toUpperCase()) {
                hasMovedRook = true;
                gamePositions[i].fig = null;
              }
            }
          }
          hasMoved = hasMovedKing && hasMovedRook;
        }
      }
      if (nextMoveData.uniqueFigure === true) {
        for (let i = 0; i < gamePositions.length; i++) {
          if (gamePositions[i].fig === nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase()) {
            hasMoved = true;
            gamePositions[i].fig = null;
            break;
          }
        }
      }
      if (hasMoved) {
        for (let i = 0; i < gamePositions.length; i++) {
          if (gamePositions[i].column === nextMoveData.moveColumn && gamePositions[i].row === nextMoveData.moveRow) {
            if (nextMoveData.moveType === "take") {
              if (gamePositions[i].fig === null && nextMoveData.movePieceType === "p") { // En passant
                let delta = nextMoveData.moveSide === "w" ? 8 : -8;
                gamePositions[i + delta].fig = null;
              }
              gamePositions[i].fig = nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase();

            } else {
              gamePositions[i].fig = nextMoveData.promoteTo ? nextMoveData.promoteTo + nextMoveData.moveSide.toUpperCase() : nextMoveData.movePieceType + nextMoveData.moveSide.toUpperCase();
            }
            break;
          }
        }
        if (nextMoveData.additionalMove != null) {
          for (let i = 0; i < gamePositions.length; i++) {
            if (gamePositions[i].column === nextMoveData.additionalMove.moveColumn && gamePositions[i].row === nextMoveData.additionalMove.moveRow) {
              gamePositions[i].fig = nextMoveData.additionalMove.movePieceType + nextMoveData.additionalMove.moveSide.toUpperCase();
              break;
            }
          }
        }

        let fenGame = this.state.fenGame;
        let fenData = fenGame.filter((x) => {
          return x.number === nextMoveData.number && x.side === nextMoveData.moveSide;
        });
        if (fenData.length === 0) {
          let gamePositions = this.state.data;
          let columnsOrdered = this.state.columns.slice(0)
          let fen = boardToFen(gamePositions, nextMoveData, columnsOrdered);
          if (fen) {
            fenGame.push({ "number": nextMoveData.number, "side": nextMoveData.moveSide, "fen": fen });
          }
        }
        this.setState((state, props) => (
          {
            "data": gamePositions,
            "move": { number: nextMoveData.number, side: nextMoveData.moveSide },
            "fenGame": fenGame,
            "status": this.gameStatus.showMoves
          }
        ));
          let that = this;
            setTimeout(function () {
              that.moveGameTo(askedMove);
            }, timing);
      }
    }
  }

  componentDidMount() {
    this.initGames();
  }

  menuMove = (e) => {
    let target = e.currentTarget.getAttribute("data-target");
    if (target in this.gameStatus) {
      this.setGameStatus(this.gameStatus[target]);
    }
  }

  movePGN = (e) => {
    let elem;
    if ("move" in e) {
      elem = e;
    } else {
      elem = (e.currentTarget).dataset;
    }
    let currentMove = this.state.move;
    let askedMove = getAskedMove(elem, currentMove, this.state.pgnGame);
    let fenMove = this.state.fenGame.filter((x) => {
      return x.number === askedMove.number && x.side === askedMove.side;
    });
    if (fenMove.length !== 0) {
      let columnsOrdered = this.state.columns.slice(0)
      let reinitData = JSON.parse(this.state.initialData);
      reinitData = fenToBoard(fenMove[0].fen, reinitData, columnsOrdered);
      let scores = boardToScore(reinitData);

      this.setState((state, props) => (
        {
          data: reinitData,
          scores:scores,
          move: {
            number: askedMove.number,
            side: askedMove.side
          }
        }
      ));
    }
  }

  savePGN = () => {
  //  let that = this;
  this.setGameStatus(this.gameStatus.showMessage, "Aanalyzing and saving your game");
      let textArea = document.getElementById("game-input");
      if (textArea != null) {
        let pgn = textArea.value;
        if (pgn !== "") { // todo check validity !
          let limitBetweenGameParts = /\n\n/.exec(pgn).index;
          let pngInfos = pgn.substring(0, limitBetweenGameParts).replace(/\r\n?|\n/g, ",").trim();
          let pgnGame = pgn.substring(limitBetweenGameParts, pgn.length).replace(/\r\n?|\n/g, " ").trim();
          // putting the infos in an object
          let infosClean = pngToInfos(pngInfos);
          if(!infosClean.Site){
            infosClean.Site = "???";
          }
          // putting the game into an array of turns ex : [{"w":"a4","b":"a5"}]
          let turns = pngToTurns(pgnGame);
          // calculating the fens for every half move
          let fenGame = [{ "number": 0, "side": "w", "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }];
          let positions = JSON.parse(this.state.initialData);
          let columnsOrdered = this.state.columns.slice(0)
  
          turns.forEach((turn, i) => {
            ["w", "b"].forEach((side) => {
              if (side in turn) {
                let nextMoveData = getMoveDataAt(turn, side, i + 1, positions, columnsOrdered);
                positions = getPositionsAt(nextMoveData, positions);
                let fen = boardToFen(positions, nextMoveData, columnsOrdered);
                if (fen) {
                  fenGame.push({ "number": nextMoveData.number, "side": nextMoveData.moveSide, "fen": fen });
                }
              }
            });
          });
          let gameToSave = {
            "pgnHistory": pgn,
            "pgnResume": infosClean,
            "pgnGame": turns,
            "fenGame": fenGame
          };
          this.saveGameToStorage(gameToSave);
          this.state.games.push(gameToSave);
          let otherProps = {
            "data": JSON.parse(this.state.initialData),
            "pgnResume": infosClean,
            "pgnHistory": pgn,
            "pgnGame": turns,
            "fenGame": fenGame,
            "move": {
              "number": 0,
              "side": "w"
            },
            "scores" : {
              "whiteScore" : 0,
              "blackScore" : 0,
              "whiteJail" : [],
              "blackJail" : []
            }
          }
          this.setGameStatus(this.gameStatus.showList, "",otherProps);
        } else {
          this.setGameStatus(this.gameStatus.inError, "unable to read this png");
        }
      }
   
  }

  saveGameToStorage = (gameToSave) => {
    this.setGameStatus(this.gameStatus.showMessage, "Saving analyzed game");

    let games = [];
    if (localStorage.getItem("games") !== null) {
      games = JSON.parse(localStorage.getItem("games"));
      let gameAlready = games.filter((x) => {
        return x.pgnGame === gameToSave.pgnGame;
      });
      if (gameAlready.length === 0) {
        games.push(gameToSave);
      } else {
        games.forEach((x) => {
          if (x.pgnGame === gameToSave.pgnGame) {
            x.pgnHistory = gameToSave.pgnHistory;
            x.pgnResume = gameToSave.pgnResume;
            x.fenGame = gameToSave.fenGame;
          }
        });
      }
    } else {
      games.push(gameToSave);
    }
    localStorage.setItem("games", JSON.stringify(games));
  }
  
  setGameStatus = (status, message,otherProps) => {
    let infos = ""
    switch (status) {
      case this.gameStatus.showInput:
        infos = { "title": "Please enter a game in PGN format", "message": "" };
        break;
      case this.gameStatus.init:
        infos = { "title": "New game saved", "message": "analysing PGN game..." };
        break;
      case this.gameStatus.showMoves:
        infos = { "title": "Game's moves", "message": "" };
        break;
      case this.gameStatus.showList:
        infos = { "title": "Choose from list", "message": "" };
        break;
      case this.gameStatus.showMessage:
        infos = { "title": "Current status", "message": message };
        break;
      case this.gameStatus.inError:
        infos = { "title": "Error !", "message": message };
        break;
      default:
        infos = { "title": "Error !", "message": "the program is in error..." };
    }
    let newState = {
      "status": status,
      "infosTitle": infos.title,
      "infosMessage": infos.message
    }
    if(otherProps){
      for (let p in otherProps){
        newState[p] = otherProps[p];
      }
    }
    this.setState((state, props) => (
      newState
    ));
  }

  initGames = () => {
    this.setState((state, props) => ({
      status: this.gameStatus.init
    }));

    let games = [];
    if (localStorage.getItem("games") !== null) {
      games = JSON.parse(localStorage.getItem("games"));
    }

    let initialStatus = this.gameStatus.showInput;
    if (games.length > 0) {
      initialStatus = this.gameStatus.showList;
    }
    
    let pgn = this.state.pgnHistory;
    let data = [];
    let positions = [];
    let blackColor = this.state.blackColor;
    let whiteColor = this.state.whiteColor;
    let black = this.state.black;
    let white = this.state.white;

    let currentColor;
    let previousColor = whiteColor;
    let row = 0;
    let col = 0;
    let i = 0;
    for (let r = 7; r >= 0; r--) {
      row = this.state.rows[r];
      for (let c = 0; c < 8; c++) {
        col = this.state.columns[c];
        i++;
        if (i % 8 === 1) {
          currentColor = previousColor;
        } else {
          currentColor = previousColor === blackColor ? whiteColor : blackColor;
          previousColor = currentColor;
        }
        data.push({ "row": row, "column": col, "squareColor": currentColor, "fig": null });
      }
    }

    this.state.figures.forEach((fig, i) => {
      positions.push({ "row": this.state.rows[0], "column": this.state.columns[i], "fig": fig + white });
      positions.push({ "row": this.state.rows[1], "column": this.state.columns[i], "fig": this.state.pawn + white });
      positions.push({ "row": this.state.rows[6], "column": this.state.columns[i], "fig": this.state.pawn + black });
      positions.push({ "row": this.state.rows[7], "column": this.state.columns[i], "fig": fig + black });
    });

    data.forEach((sqr) => {
      let check = positions.filter((pos) => {
        return pos.row === sqr.row && pos.column === sqr.column;
      });
      if (check.length === 1) {
        sqr.fig = check[0].fig;
      }
    });
    let otherProps = {
      "games":games,
      "status": initialStatus,
      "data": data,
      "initialData": JSON.stringify(data),
      "positions": positions,
      "move": { "number": 0, "side": "w" },
      "pgnHistory": pgn,
      "scores" : {
        "whiteScore" : 0,
        "blackScore" : 0,
        "whiteJail" : [],
        "blackJail" : []
      }
    }
    this.setGameStatus(initialStatus, "",otherProps);
  }

  render() {
    if (this.state.status === this.gameStatus.showInput) {// todo : adapt to input in textArea
      return (
        <div className="game">
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} game={this.state} movePGN={this.movePGN} menuMove = {this.menuMove} savePGN={this.savePGN} statuses={this.gameStatus}></Info>
          </div>
        </div>
      )
    } else if (this.state.status === this.gameStatus.showList) { // todo : adapt to list
      return (
        <div className="game">
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} game={this.state} loadGame={this.loadGame} deleteGame={this.deleteGame} menuMove = {this.menuMove} statuses={this.gameStatus}></Info>
          </div>
        </div>
      )
    } else if (this.state.status === this.gameStatus.showMoves) { // todo : adapt to list
      return (
        <div className="game">
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} game={this.state} movePGN={this.movePGN} menuMove = {this.menuMove} savePGN={this.savePGN} statuses={this.gameStatus}></Info>
          </div>
        </div>
      )
    }else if (this.state.status === this.gameStatus.showMessage) { // todo : adapt to list
      return (
        <div className="game">
          <div >
            <h1> {this.state.infosTitle} </h1>
            <p> {this.state.infosMessage} </p>
          </div>
        </div>
      )
    }
    else { // Adapt to other status such as error
      return (
        <div className="game">
          <h1> Loading </h1>
        </div>
      );
    }
  }
}

export default Game;

