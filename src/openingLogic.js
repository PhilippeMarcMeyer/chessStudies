import {ecoOpenings} from './openings.js'; 


const findOpeningByFen = (moveFen) => {
    let fenHead = moveFen.split(" ")[0];
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.fen === fenHead;       
    });
    return possibleOpenings;
}

const findOpeningByCode = (ecoCode) => {
    let possibleOpenings = ecoOpenings.filter((x) => {
        return x.ecoCode === ecoCode;
    });
    return possibleOpenings;
}

const findGamesByFen = (state,fen,move) => {
    let result = {"originalKey":state.gameKey,"move":move,games:null};
    let fenModelSearch = state.fenGame.filter((x)=>{
        return x.number === move.number && x.side === move.side;
    });
    if(fenModelSearch.length > 0){
        let fenModel = fenModelSearch[0].fen.split(" ")[0];
        if(state.games.length>0){
            let games = [];
            state.games.forEach((x)=>{
                let fens = x.fenGame.filter((f)=>{
                    return f.fen.indexOf(fenModel) !== -1 && x.id !== state.gameKey ;
                });
                if(fens.length > 0){
                    let digest = x.pgnResume.White + " vs " +  x.pgnResume.Black + " ["+x.pgnResume.Result+"] " + x.pgnResume.Date;
                    games.push({"key":x.id,"move":{"number":fens[0].number,"side":fens[0].side,"movesList":x.pgnGame},"digest":digest});
                }
            });
            result.games = games;
        }
    }
    return result;
}

export {findOpeningByFen,findOpeningByCode,findGamesByFen};