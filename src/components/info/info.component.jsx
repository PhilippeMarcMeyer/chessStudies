import React from 'react';
import './info.styles.css';

function savepgn(){
  let ptr = document.getElementById("game-input");
  console.log('click')
  if(ptr!= null){
    let pngData = ptr.value;
    console.log(pngData)
    localStorage.setItem("pgnHistory",pngData);
  }
}

function noPGNInfos(pgn) {
  return (
  <div>
    <textarea id="game-input" className="game-input" name="pgn">{pgn}</textarea>
    <button onClick={savepgn}>Go</button>
  </div>
  );
}

function PGNInfos(props) {
  return (
  <div>
    PGNInfos....
  </div>
  );
}

const Info = (props) => {
  let infosTemplate;
  let isPGNon = props.game.pgnOn;
  let pgn = props.game.pgnHistory
  if (isPGNon) {
    infosTemplate = PGNInfos();
  } else {
    infosTemplate = noPGNInfos(pgn);
  }
  return(
  <div className='board-zone'>
   <h3 className='board-title'>{props.game.infos}</h3>
    {infosTemplate}
   </div>
  )
   }
  export default Info;