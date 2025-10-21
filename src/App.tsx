import { error } from 'console';
import './App.css';
import "./index.css"
import { callbackify } from 'util';
import { ChangeEvent, useState } from 'react';
import { Input } from 'postcss';
import { Target } from 'inspector/promises';


const DEFAULT_LIVES = 3;

function App() {
  const [is_playing, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(DEFAULT_LIVES);
  const [numToFind, setNumToFind] = useState(0);

  const start_game = (is_playing:boolean) => {
    setIsPlaying(is_playing);
    if (is_playing){
      setNumToFind(Math.floor(Math.random()*9999));
    }
  };

  const change_lives = (new_lives_value:number) => {
    setLives(new_lives_value);
  };

  let divManageGame = null

  if (!is_playing){
    divManageGame = DivManageGame(start_game, change_lives);
  }

  //handleAnswer


  return (
    <div className={is_playing ? "App-playing" : "App-not-playing"}>
      <header className={is_playing ? "App-header-playing" : "App-header-not-playing"}>
        {divManageGame}
      </header>
      <div className={is_playing ? 'body-customized-playing' : "body-customized-not-playing"}>
        <GameSection/>
      </div>
      <div className='App-footer'>
        <p>Je suis footer</p>
      </div>
    </div>
  );
}


/* Return a component witch is a div with fields stuffs 
to configure game*/
function DivManageGame(parentCallbackStartGame:(v:boolean)=>void,
                      parentCallbackChangeLives:(i:number)=>void,
                    )
{
  const button_play = ButtonPlay(parentCallbackStartGame);
  const field_game_lives = FieldGame("life", true, parentCallbackChangeLives)
  return (
    <div className="div-menu">
      <h1>Configuration pour le jeu</h1>
      {field_game_lives}
      {button_play}
    </div>
  )
}

function GameSection(){
  return (
    <div className="div-game-section">
      <div className='justify-left'>
        <label htmlFor="player-value">Votre réponse ?</label>
        <input name="player-value" type="int" defaultValue="0"/>
        <button>Valider</button>
      </div>
    </div>
    
  )
}

/* Return a component that is a set of elements for configuring game,
Build div with label and input element*/
function FieldGame(element_name="", is_num=true, parentCallback:(v:number)=>void){
  let type_field = "normal";
  if (is_num){
    type_field = "numeric";
  }

  const inputCallback = (e:ChangeEvent<HTMLInputElement>) => {
    console.log("e target value :", e.target.value);
    parentCallback(Number(e.target.value));
  }
  
  return (
    <div className={`div_${element_name}`}>
      <div>
        <label className={`label_${element_name}`} htmlFor={`input-${element_name}`}>Vies :</label>
        <input name={`input-${element_name}`} type={type_field} defaultValue={DEFAULT_LIVES} onChange={inputCallback}/>
      </div>
    </div>
  )
}

function ButtonPlay(parentCallback:(v:boolean) => void){
  const handleButtonPlay = () => {
    parentCallback(true); //refresh playing
    console.log("click");
  }
  return (
    <div className='button-play-center'>
      <button className='btn-play' onClick={handleButtonPlay} >Jouer</button>
    </div>
  )
}


export default App;
