import React from 'react';
import './info.styles.css';

function noPGNInfos(props) {
  return (
  <div>
    <textarea class="game-input" name="pgn"></textarea>
    <button>Go</button>
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
  const isPGNon = props.game.pgnOn;

  if (isPGNon) {
    infosTemplate = PGNInfos();
  } else {
    infosTemplate = noPGNInfos();
  }
  return(
  <div className='board-zone'>
   <h3 className='board-title'>{props.game.infos}</h3>
    {infosTemplate}
   </div>
  )
   }
  export default Info;