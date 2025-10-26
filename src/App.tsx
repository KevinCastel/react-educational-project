import { error } from 'console';
import './App.css';
import "./index.css"
import { callbackify } from 'util';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { Input } from 'postcss';
import { Target } from 'inspector/promises';

//declared as module in custom.d.ts
import HeartLife from "./heart-svgrepo-com.svg";

// import { ReactComponentElement } from 'react';
// import {ReactComponent as HeartSvg} from './heart-svgrepo-com.svg';



const DEFAULT_LIVES = 3;

function App() {
  const [is_playing, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(DEFAULT_LIVES);
  const [numToFind, setNumToFind] = useState(0);
  const [stillSeconds, setStillSeconds] = useState(0);

  const start_game = (is_playing:boolean) => {
    setIsPlaying(is_playing);
    if (is_playing){
      setNumToFind(Math.floor(Math.random()*9999));
    }
  };

  const change_lives = (new_lives_value:number) => {
    setLives(new_lives_value);
  };

  let game_infos = null;

  if (is_playing) {
    game_infos = InformationsGame(lives, stillSeconds);
  } else {
    game_infos = ConfigurationGame(start_game, change_lives);
  }

  const inputGame = InputGame(numToFind);

  return (
    <div className={is_playing ? "App-playing" : "App-not-playing"}>
      <header>
        {game_infos}
      </header>
      <div className={is_playing ? 'body-customized-playing' : "body-customized-not-playing"}>
        {inputGame}
      </div>
      <div className='App-footer'>
        <p>Je suis footer<br />
        https://www.svgrepo.com/svg/535436/heart - Heart Icon</p>
      </div>
    </div>
  );
}

/* Components for detailling during game */
function InformationsGame(liveStill:number, timeStill:number){
  let index = 0;
  const images = []
  const svg_size = "14%";
  for(index = 0; index < liveStill; index ++){
    images[index] = <img height={svg_size} width={svg_size} key={`life-${index}`} src={HeartLife} alt={`life-${index}`}/>
  }

  return <div className='div-menu-playing'>
    <h1>À vous de jouer ?!</h1>
    <div className='game-informations'>
      <div className='lifes'>
        <h2>Vos vies</h2>
        <div className='lifes-svg'>
          {images.map(i => i)}
        </div>
      </div>
      <div className='times'>
        <h2>Encore<br/>{timeStill} secondes</h2>
      </div>
    </div>
  </div>
}


/* Return a component witch is a div with fields stuffs 
to configure game*/
function ConfigurationGame(parentCallbackStartGame:(v:boolean)=>void,
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

// Input with button and label as one Component for the game
function InputGame(numToFind:number){
  const [valueUser, setValueUser] = useState(0);

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
    if (valueUser == numToFind){
      alert("félicaition, c'est gagné!");
    } else if (valueUser > numToFind){
      alert("Ta valeur est trop haute");
    } else {
      alert("Ta valeur est trop basse");
    }
  };

  return (
    <div className="div-game-section">
        <form className='justify-left' onSubmit={handleSubmit}>
          <label htmlFor="player-value">Votre réponse ?</label>
          <input name="player-value" type="int" onChange={(e) => setValueUser(Number(e.target.value))} defaultValue="0"/>
          <button type='submit'>Valider</button>
        </form>
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

// parentCallback is to play
function ButtonPlay(parentCallback:(v:boolean) => void){
  const handleButtonPlay = () => {
    parentCallback(true); //refresh playing
  }
  return (
    <div className='button-play-center'>
      <button className='btn-play' onClick={handleButtonPlay} >Jouer</button>
    </div>
  )
}


export default App;
