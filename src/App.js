import React, { useState } from 'react';
import './App.css';
import Header from './components/header/header.component';
import Game from './components/game/game.component';

function App() {

  const [parentInfos, setParentInfos] = useState({"storageType":"no data"});

  return (
    <div className="App">
      <Header parentInfos={parentInfos} />
      <Game parentInfos={parentInfos} setParentInfos={setParentInfos}/>
    </div>
  );
}

export default App;
