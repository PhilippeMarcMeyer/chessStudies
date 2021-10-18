import React from 'react';
import './game.styles.css';
import Board from '../board/board.component';
import Info from '../info/info.component';
import { getAskedMove, getNextMove, pngToTurns, pngToInfos, getMoveDataAt, getPositionsAt ,boardToScore} from '../../movesLogic.js';
import { ManageStorage} from '../../storage.js';
import { boardToFen, fenToBoard } from '../../fen.js';
import {findOpeningByFen,findOpeningByCode,findGamesByFen} from '../../openingLogic.js';
import Analysis from '../analysis/analysis.component';
import Login from '../login/login.component';

class Game extends React.Component {
  constructor(props) {
    super();
    this.gameStatus = {
      "init": 0,
      "showList": 1,
      "showInput": 2,
      "showMoves": 3,
      "showMessage": 4,
      "unauthorized": 5,
      "readingError":6,
      "unknownError":7,
      "inError": -1,
    };

    this.state = {
      "windowWidth" : window.innerWidth,
      "commentIsOpen":false,
      "comments":"",
      "identicalGames": {},
      "analysis":null,
      "storageManager":null,
      "isRemote": true,
      "initError":false,
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
      "currentOpening": null,
      "knownOpenings" : {list:["all"],selected:"all",searchByRootName : true},
      "knownPlayers" : {list:["all"],selected:"all"},
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
    let id = Number(e.currentTarget.getAttribute("data-index"));
    this.doDeleteGame(id);
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.reload(); // bad an temporary
    },800);
  }

  loadGame = (e) => {
    let id = Number(e.currentTarget.getAttribute("data-index"));
    if(e.currentTarget.hasAttribute("data-number")){ // identical games in analysis
        let nr = Number(e.currentTarget.getAttribute("data-number"));
        let side = e.currentTarget.getAttribute("data-side");
        this.doLoadGame(id,{"number":nr,"side":side});
    }else{
      this.doLoadGame(id); // from games list
    }
  }

  doDeleteGame = (id) => {
    let factory = this;
    if (this.state.isRemote && this.state.storageManager) {

      let games = this.state.games.filter((game) => {
        return game.id !== id;
      })

      let otherProps = {
        games: games
      }

      factory.state.storageManager.deleteRemote(id)
        .then(function (response) {
          if (response === "OK") {
            factory.state.storageManager.setLocal(games);
            let newStatus = games && games.length > 0 ? factory.gameStatus.showList : factory.gameStatus.showInput;
            factory.setGameStatus(newStatus, "", otherProps);
          }
        })
        .catch(function (response) {

        });
    }
  }

  doLoadGame = (id,atMove) => {
    let loadAndMove = true;
    let gamesFilter = this.state.games.filter((game) => {
      return game.id === id;
    })
    if(!atMove){
      atMove = {"number":0,"side":"w"};
      loadAndMove = false;
    }
    if (gamesFilter.length === 1) {
      let game = gamesFilter[0];
      let otherProps = {
        "comments": game.comments || "",
        "gameKey" : id,
        "analysis":null,
        "data": JSON.parse(this.state.initialData),
        "pgnResume": game.pgnResume,
        "pgnHistory": game.pgnHistory,
        "pgnGame": game.pgnGame,
        "fenGame": game.fenGame,
        "move": {
          "number": atMove.number,
          "side": atMove.side
        },
        "scores": {
          "whiteScore": 0,
          "blackScore": 0,
          "whiteJail": [],
          "blackJail": []
        }
      }
      if(loadAndMove){
        let fenMove = game.fenGame.filter((x) => {
          return x.number === atMove.number && x.side === atMove.side;
        });
        if (fenMove.length !== 0) {
          let columnsOrdered = this.state.columns.slice(0)
          let gamePositions = fenToBoard(fenMove[0].fen, otherProps.data, columnsOrdered);
          let scores = boardToScore(gamePositions);
          otherProps.data = gamePositions;
          otherProps.scores = scores;
          otherProps.openingFiltered = this.state.openingFiltered;
          otherProps.analysis = this.state.analysis;

        }
      }
      this.setGameStatus(this.gameStatus.showMoves, "", otherProps);
    }
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
    let nextMoveData = getNextMove(gamePgn, currentMove, askedMove, columnsOrdered,gamePositions);

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
    this.initData();
    window.addEventListener("resize",() => {
      this.setState({"windowWidth":window.innerWidth});
    })
  }
  componentWillUnmount() {
    window.addEventListener("resize",() => {
      this.setState({"windowWidth":window.innerWidth});
    })
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
      let openingFiltered = findOpeningByFen(fenMove[0].fen);
      let identicalGames = {};
      if(askedMove.number > 2){
        identicalGames = findGamesByFen(this.state,fenMove[0].fen,askedMove);
      }
      
      let currentOpening = null;
      let analysis = this.state.analysis;

      if(openingFiltered.length > 0){
        currentOpening = openingFiltered[0];
        analysis = {
          title : "Opening :",
          text : currentOpening.opening,
          move: askedMove.move,
          moves : currentOpening.moves
        }
      }else{
        if(analysis !== null && analysis.move <  askedMove.move){
          analysis = null;
        }
      }
      this.setState((state, props) => (
        {
          identicalGames:identicalGames,
          analysis:analysis,
          data: reinitData,
          scores:scores,
          currentOpening:currentOpening,
          move: {
            number: askedMove.number,
            side: askedMove.side
          }
        }
      ));
    }
  }

  openComments = () => {
    this.setState({
      commentIsOpen : true
    })
  }

  doLogOut = () => {
    if (this.state.storageManager) {
      this.state.storageManager.logout();
    }
  }
  
  doLogin = (username,password) => {
    let factory = this;
    if (this.state.storageManager) {
      this.state.storageManager.login(username,password)
      .then(function (response) {
        factory.initData();
      })
      .catch(function (response) {

      });
    }
  }

  saveComment = (e) => {
    let comments = document.querySelector(e.currentTarget.getAttribute("data-target")).value;
    if (comments !== this.state.comments) {
      let id = this.state.gameKey;
      let games = [...this.state.games];
      games.forEach((x)=> {
        if(x.id === id){
          x.comments = comments;
        }
      });
      this.setState({
        games:games,
        commentIsOpen : false,
        comments : comments
      }, () => {
        this.saveCurrentAnalysedGame();
      })
    }
  }

  saveCurrentGameOpening = () => {
      if (this.state.analysis) {
        const pgnResume = {...this.state.pgnResume};
        pgnResume.opening = this.state.analysis.text;
        pgnResume.openingMoves = this.state.analysis.moves;
        this.setState({
          pgnResume
        }, () => {
          this.saveCurrentAnalysedGame();
        })

      }
    }

  saveCurrentAnalysedGame = () =>{
    let id = this.state.gameKey;
    if(id && !isNaN(id)){
      let gameToSave = {
        "id": id,
        "comments":this.state.comments,
        "pgnHistory": this.state.pgnHistory,
        "pgnResume": this.state.pgnResume,
        "pgnGame":this.state.pgnGame,
        "fenGame": this.state.fenGame
      };
      this.saveGameToStorage(gameToSave)
    }
  }

  savePGN = (data) => {
    let result = null;
    if(data.infos && data.infos.length > 0 && data.game && data.game.length > 0){
      data.infos = data.infos.replace(/\r\n?|\n/g, ",").trim();
      data.game = data.game.replace(/\r\n?|\n/g, " ").trim();
      // putting the infos in an object
      let infosClean = pngToInfos(data.infos);
      if(!infosClean.Site){
        infosClean.Site = "???";
      }
      // putting the game into an array of turns ex : [{"w":"a4","b":"a5"}]
      let turns = pngToTurns(data.game);
      // calculating the fens for every half move
      let fenGame = [{ "number": 0, "side": "w", "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }];
      let positions = JSON.parse(this.state.initialData);
      let columnsOrdered = this.state.columns.slice(0);
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
        "pgnHistory": data.game,
        "pgnResume": infosClean,
        "pgnGame": turns,
        "fenGame": fenGame
      };
      setTimeout(()=>{
        this.saveGameToStorage(gameToSave);
      },500);
      let otherProps = {
        "data": JSON.parse(this.state.initialData),
        "pgnResume": infosClean,
        "pgnHistory": data.game,
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
      result = otherProps;
    }
    return result;
  }

  savePGNs = () => {
    this.setGameStatus(this.gameStatus.showMessage, "Analyzing and saving your games");
    let textArea = document.getElementById("game-input");
    let result = null;
    if (textArea != null) {
      let toImport = textArea.value;
      if (toImport !== "") { 
        let severalPGN = toImport.split("\n\n");
        if(severalPGN.length % 2 === 0){
          let data = null;
          severalPGN.forEach((pgn,i)=>{
            if(i%2===0){
              data = {"infos":pgn};
            }else{
              data.game = pgn;
              setTimeout(()=>{
                this.savePGN(data);
                this.setGameStatus(this.gameStatus.showList, "",result);
              },500);
            }
          });
        }
      }
    }
  }

  saveGameToStorage = (gameToSave) => {
    let factory = this;
    if(!("id" in gameToSave)){
      gameToSave.id = new Date().getTime();
    }
    let games = [...this.state.games];
    if (games.length === 0) {
      games.push(gameToSave);
    } else {
      let gameAlready = games.filter((x) => {
        return x.id === gameToSave.id;
      });
      if (gameAlready.length === 0) {
        games.push(gameToSave);
      } else {
        games.forEach((x) => { // rewrite in the future : add comments etc...
          if (x.id === gameToSave.id) {
            x.comments = gameToSave.comments;
            x.pgnHistory = gameToSave.pgnHistory;
            x.pgnResume = gameToSave.pgnResume;
            x.fenGame = gameToSave.fenGame;
          }
        });
      }
    }
    games.forEach((x) => {
      if(!("dateTag" in x) && "Date" in x.pgnResume){
        let arr = x.pgnResume.Date.split(".");
        if(arr.length === 3){
          x.dateTag = new Date(Number(arr[0]),Number(arr[1]),Number(arr[2])).getTime();
        }
      }
    })
    
    if (this.state.isRemote && this.state.storageManager) {
        factory.state.storageManager.setRemote(gameToSave)
        .then(function (response) {
          if (response === "OK") {
            factory.state.storageManager.setLocal(games);
          }
        })
        .catch(function (response) {

        });
      }

      this.setState({
        games
      });
  }

  onChangeOpening = (e) => {
    let value = e.currentTarget.value;
    let knownOpenings = {...this.state.knownOpenings};
    knownOpenings.selected = value;
    this.setState((state, props) => (
      {knownOpenings}
    ));
  }

  onChangePlayer = (e) => {
    let value = e.currentTarget.value;
    let knownPlayers = {...this.state.knownPlayers};
    knownPlayers.selected = value;
    this.setState((state, props) => (
      {knownPlayers}
    ));
  }

  getKnowPlayers = (games) => {
    let knownPlayers = {...this.state.knownPlayers};
    let playersList = [];
    if (games.length > 0) {
      games.forEach((x) => {
        if ("Black" in x.pgnResume && x.pgnResume.Black){
          playersList.push(x.pgnResume.Black.trim())
        }
        if ("White" in x.pgnResume && x.pgnResume.White){
          playersList.push(x.pgnResume.White.trim())
        }
      });

      const uniqueSet = new Set(playersList);
      playersList = [...uniqueSet];
      knownPlayers.list = playersList.sort();
      knownPlayers.list = ["all"].concat(knownPlayers.list)
      knownPlayers.selected = "all";
    }
    return knownPlayers;
  }
  
getKnowOpenings = (games) => {
    let knownOpenings =this.state.knownOpenings;

    if (games.length > 0) {
      let openingsList = games.map((x) => {
        return "opening" in x.pgnResume ? x.pgnResume.opening : null;
      });
      openingsList = openingsList.filter((x) => {
        return x !== null;
      });

      if(knownOpenings.searchByRootName){
        openingsList = openingsList.map((x) => {
          let pos = x.indexOf(":");
          if(pos !== -1){
            return x.substring(0,pos).trim();
          }else{
            return x.trim();
          }
        });
      }
      const uniqueSet = new Set(openingsList);
      openingsList = [...uniqueSet];
      knownOpenings.list = openingsList.sort();
      knownOpenings.list = ["all"].concat(knownOpenings.list)
      knownOpenings.selected = "all";
    }
    return knownOpenings;
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
      case this.gameStatus.unauthorized:
        infos = { "title": "Error !", "message": "Please login in or contact philmageo on github to have an account" };
        break;
      case this.gameStatus.readingError:
        infos = { "title": "Error !", "message": "Could not load your games due to a technical issue, sorry" };
        break;
      case this.gameStatus.unknownError:
        infos = { "title": "Error !", "message": "Could not load your games due to an unknown error, sorry" };
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

  initData = () => {
    let factory = this;
    let storageManager = this.state.storageManager || new ManageStorage();
    let dataStatus = "nodata";
    let chessGames = null;

    storageManager
      .initRemote()
      .then(function (data) {
        if("error" in data){
          dataStatus = data.error;
          factory.launchInits(dataStatus,null,storageManager);
        }else{
          dataStatus = "remote"
          chessGames = [...data];
          factory.launchInits(dataStatus,chessGames,storageManager);
        }
      })
      .catch(function (err) {
          storageManager
          .initLocal()
          .then(function (data) {
            dataStatus = "local";
            chessGames = [...data];
            factory.launchInits(dataStatus,chessGames,storageManager);
          })
          .catch(function (e) {
            dataStatus = "nodata"
            factory.launchInits(dataStatus,null,storageManager);
          });
          return;
      });


  }

  launchInits = (dataStatus,chessGames,storageManager) =>{
    let factory = this;
    if(dataStatus === "nodata"){
      factory.initGames(null, false, true,storageManager);
    }else if(dataStatus === "sessionError"){
      factory.setGameStatus(factory.gameStatus.unauthorized, "",{storageManager:storageManager});  
    }else if(dataStatus === "readingError"){
      factory.setGameStatus(factory.gameStatus.readingError, "",{storageManager:storageManager});  
    }else if(dataStatus === "remote"){
      factory.initGames(chessGames, true, false,storageManager);
    }else if(dataStatus === "local"){
      factory.initGames(chessGames, false, false,storageManager);
    }else{
      factory.setGameStatus(factory.gameStatus.unknownError, "",{storageManager:storageManager});  
    }
  }


  initGames = (games,isRemote,initError,storageManager) => {
    if(initError){
      let initialStatus = this.gameStatus.inError;
      this.props.setParentInfos({"storageType":"no data","logOut":this.doLogOut});
      let otherProps = {
        isRemote: isRemote,
        initError:initError,
        storageManager:storageManager
      }
      this.setGameStatus(initialStatus, "",otherProps);
     }else{
      let storageType = isRemote ? "online":"disconnected";
      this.props.setParentInfos({"storageType":storageType,"logOut":this.doLogOut});

      games.sort((a,b) => {
        return b.dateTag - a.dateTag;
      })

      games.forEach((game) => {
        if(!("opening" in game.pgnResume) && "ECO" in game.pgnResume){
          let openingFiltered = findOpeningByCode(game.pgnResume.ECO);
          if(openingFiltered.length > 0){
            game.pgnResume.opening = openingFiltered[0].opening;
            game.pgnResume.openingMoves = openingFiltered[0].moves;
          }else{
            game.pgnResume.opening = "?";
            game.pgnResume.openingMoves = "";
          }
        }
      });

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
      let knownPlayers = this.getKnowPlayers(games);
      let knownOpenings = this.getKnowOpenings(games);
      let otherProps = {
        "knownPlayers":knownPlayers,
        "knownOpenings": knownOpenings,
        "storageManager":storageManager,
        "games":games,
        "data": data,
        "isRemote": isRemote,
        "initError":initError,
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
  };
  render() {
    if (this.state.status === this.gameStatus.showInput) {// todo : adapt to input in textArea
      if(!this.state.isRemote){
        return (
        <div className="game">
          <div >
            <h1>"Offline Mode"</h1>
            <p>You can't add games in offline mode, sorry :-( </p>
          </div>
        </div>
        )
      }else{
      return (
        <div className="game">
          <a href="/logout" className="logOut">LogOut</a>
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} game={this.state} movePGN={this.movePGN} menuMove = {this.menuMove} savePGN={this.savePGNs} statuses={this.gameStatus}/>
          </div>
        </div>
      )
    }
    } else if (this.state.status === this.gameStatus.showList) { // todo : adapt to list
      return (
        <div className="game">
           <a href="/logout" className="logOut">LogOut</a>
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} onChangePlayer={this.onChangePlayer} knownPlayers={this.state.knownPlayers} onChangeOpening={this.onChangeOpening} knownOpenings={this.state.knownOpenings} game={this.state} loadGame={this.loadGame} deleteGame={this.deleteGame} menuMove = {this.menuMove} statuses={this.gameStatus}/>
          </div>
        </div>
      )
    } else if (this.state.status === this.gameStatus.showMoves) { // todo : adapt to list
      return (
        <div className="game">
          <a href="/logout" className="logOut">LogOut</a>
          <div className="game-board">
            <Board key={1} reverseBoard={this.reverseBoard} game={this.state} />
          </div>
          <div className="game-info">
            <Info key={1} game={this.state} movePGN={this.movePGN} menuMove = {this.menuMove} savePGN={this.savePGNs} statuses={this.gameStatus}/>
          </div>
          <div className="game-analysis">
            <Analysis key={1} analysis={this.state.analysis} saveOpening={this.saveCurrentGameOpening} openComments={this.openComments} identicalGames={this.state.identicalGames} commentIsOpen={this.state.commentIsOpen} comments={this.state.comments} saveComment = {this.saveComment} loadGame={this.loadGame}/>
          </div>
        </div>
      )
    }else if (this.state.status === this.gameStatus.showMessage) { // todo : adapt to list
      return (
        <div className="general-message">
          <div >
            <h1> {this.state.infosTitle} </h1>
            <p> {this.state.infosMessage} </p>
          </div>
        </div>
      )
    }
    else if (this.state.status === this.gameStatus.unauthorized) { 
      return (
        <div>
          <Login doLogin={this.doLogin}/>
        </div>
      )
    }
    else if (this.state.status === this.gameStatus.readingError || this.state.status === this.gameStatus.unknowError) { 
      return (
        <div className="general-message">
          <div >
            <h1> {this.state.infosTitle} </h1>
            <p> {this.state.infosMessage} </p>
          </div>
        </div>
      )
    }
    else { // Adapt to other status such as error
      return (
        <div className="general-message">
          <h1> Loading ...</h1>
        </div>
      );
    }
  }
}

export default Game;

