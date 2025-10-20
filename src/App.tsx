import { error } from 'console';
import './App.css';
import "./index.css"
import { callbackify } from 'util';
import { useState } from 'react';
import { Input } from 'postcss';


const DEFAULT_LIVES = 3;

function App() {
  const [is_playing, setIsPlaying] = useState(false);
  const start_game = (childData:boolean) => {
    setIsPlaying(childData === true);
    console.log("refresh isplauing :", childData);
  };

  const divManageGame = DivManageGame(start_game);

  return (
    <div className="App">
      <header className="App-header">
        {divManageGame}
      </header>
      <div className='body-customized'>

      </div>
      <div className='App-footer'>
        <p>Je suis footer</p>
      </div>
    </div>
  );
}


/* Return a component witch is a div with fields stuffs 
to configure game*/
function DivManageGame(parentCallback:(v:boolean)=>void){
  const buttonPlay = ButtonPlay(parentCallback);
  return (
    <div className="div_menu">
      <h1>Configuration pour le jeu</h1>
      <FieldGame element_name='life' />
      {buttonPlay}
    </div>
  )
}

/* Return a component that is a set of elements for configuring game,
Build div with label and input element*/
function FieldGame({element_name="", is_num=true}){
  let type_field = "normal";
  if (is_num){
    type_field = "numeric";
  }
  const div_name = `div_${element_name}`;
  
  const [lives, setLives] = useState(DEFAULT_LIVES);

  return (
    <div className={div_name}>
      <div>
        <label>Vies :</label>
        <input type={type_field} defaultValue={DEFAULT_LIVES} onChange={e => setLives(Number(e.target.value))}/>
      </div>
    </div>
  )
}

function ButtonPlay(parentCallback:(v:boolean) => void){
  const handleButtonPlay = () => {
    // console.log("start game ?");
    parentCallback(true); //refresh playing
  }
  return <button onClick={handleButtonPlay}>Jouer</button>
}

function startGame(){
  console.log("startGame is clicked");
}

export default App;
