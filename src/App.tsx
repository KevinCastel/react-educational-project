import { error } from 'console';
import './App.css';
import "./index.css"
import { callbackify } from 'util';
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Input } from 'postcss';
import { Target } from 'inspector/promises';
import { setDefaultCACertificates } from 'tls';

//declared as module in custom.d.ts
// import HeartLife from "./heart-svgrepo-com.svg";

// import { ReactComponentElement } from 'react';
// import {ReactComponent as HeartSvg} from './heart-svgrepo-com.svg';



const DEFAULT_LIVES = 3;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(DEFAULT_LIVES);
  const [configLives, setConfigLives] = useState(DEFAULT_LIVES);
  const [numToFind, setNumToFind] = useState(0);
  // const [stillSeconds, setStillSeconds] = useState(0);
  const [lastInputValue, setLastInputValue] = useState(0);
  const [isInputHigherThanNumToFind, setIsInputHigherThanNumToFind] = useState(false);  

      
    // handleTime(setStillSeconds) https://stackoverflow.com/questions/75373182/how-to-create-a-timer-inside-hooks-on-reactjs
    
  const startGame = (isPlaying:boolean) => {
    setIsPlaying(isPlaying);
      if (isPlaying){
        setNumToFind(Math.floor(Math.random()*9999));
      };
    }
  
    //                                   (newLivesValue:number) => {
  //                                     setLives(newLivesValue);
  //                                   },


  return (
    <div className={isPlaying ? "App-playing" : "App-not-playing"}>
      <header>
        <GetGameInterface setLives={setLives} lives={lives}
                          setConfigLives={setConfigLives} configLives={configLives}
                          isPlaying={isPlaying} stillSeconds={-1}
                          startGame={startGame}/>
      </header>
      <div className={isPlaying ? 'body-customized-playing' : "body-customized-not-playing"}>
        <InputGame numToFind={numToFind}
                    isPlaying={isPlaying}
                    setLastInput={setLastInputValue}
                    setLives={setLives}
                    lives={lives}
                    setIsPlaying={setIsPlaying}/>
        <InputInformationParty
            isPlaying={isPlaying}
            lastInputValue={lastInputValue}
            isInputHigherThanNumToFind={isInputHigherThanNumToFind}/>
      </div>
      <div className='App-footer'>
        <p>Je suis footer<br />
        https://www.svgrepo.com/svg/535436/heart - Heart Icon</p>
      </div>
    </div>
  );
}

//handle the time of the party during the game
// function handleTime(setStillSeconds:Dispatch<SetStateAction<number>>) : boolean{
//   useEffect(()=>{

//   })
//   return true;
// }

function LosingGame({setIsPlaying}:{setIsPlaying:Dispatch<SetStateAction<boolean>>}){
  setIsPlaying(false);
}

interface GameInterfaceProps{
  isPlaying: boolean,
  lives: number,
  stillSeconds: number,
  startGame: (v:boolean) => void,
  setLives:Dispatch<SetStateAction<number>>,
  setConfigLives:Dispatch<SetStateAction<number>>,
  configLives:number,
}

//Return the appropriate game menu interface for 
function GetGameInterface({isPlaying, lives, stillSeconds, startGame,
                          setLives, setConfigLives, configLives}:GameInterfaceProps){
  if (isPlaying) {
    return InformationsGame(lives, stillSeconds);
  }
  return ConfigurationGame(startGame, setLives, configLives, setConfigLives);
}


interface InputInformationPartyProps {
  isPlaying : boolean;
  lastInputValue : number,
  isInputHigherThanNumToFind : boolean;
}

//Component for rendering game informations on input user during the game 
function InputInformationParty({isPlaying, lastInputValue, isInputHigherThanNumToFind}:InputInformationPartyProps){
  if (!isPlaying){
    return null;
  }
  const messageOnTheValue = isInputHigherThanNumToFind?"La valeur est trop haute":"La valeur est trop basse";


  return (<div className='infos-party'>
    {lastInputValue!=0?<h2>Dernièrement, vous avez tapé :{lastInputValue.toString()} <br/> {messageOnTheValue}</h2> : null}
  </div>)
}

/* Components for detailling during game */
function InformationsGame(liveStill:number, timeStill:number){
  let index = 0;
  // const images = []
  const svg_size = "14%";
  // for(index = 0; index < liveStill; index ++){
  //   images[index] = <img height={svg_size} width={svg_size} key={`life-${index}`} src={HeartLife} alt={`life-${index}`}/>
  // }

  return <div className='div-menu-playing'>
    <h1>À vous de jouer ?!</h1>
    <div className='game-informations'>
      <div className='lives'>
        <h2>Encore<br/>{liveStill} vies</h2>
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
                      setLives:Dispatch<SetStateAction<number>>,
                      configLives:number,
                      setConfigLives:Dispatch<SetStateAction<number>>,
                    )
{
  const handleSubmitPlay = (e:SyntheticEvent) => {
    e.preventDefault();
    setLives(configLives);
    console.log("starting game");
    parentCallbackStartGame(true);
  };
  return (
    <div className="div-menu">
      <form onSubmit={handleSubmitPlay}>
        <h1>Configuration pour le jeu</h1>
        <FieldGame elementName='life' isNum={true} setConfigLives={setConfigLives} configLives={configLives}/>
        <button className='btn-play'>Jouer</button>
      </form>
    </div>
  )
}

function boolToInt(b:boolean):number{
  if (b){
    return 1;
  };
  return 0;
}

interface InputGameProps{
  numToFind : number,
  isPlaying : boolean,
  setLastInput:Dispatch<SetStateAction<number>>, //parent callback from 'app'
  setLives:Dispatch<SetStateAction<number>>,
  lives:number,
  setIsPlaying:Dispatch<SetStateAction<boolean>>
}

// Input with button and label as one Component for the game
function InputGame({numToFind,isPlaying, setLastInput, setLives, lives, setIsPlaying}:InputGameProps){
  const [valueUser, setValueUser] = useState(0);

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
      if (!isPlaying){
      alert("Pas encore en jeu..!")
      return;
    }

    setLastInput(valueUser);
    if (lives > 0){
      setLives(lives-boolToInt(valueUser!=numToFind));
    } else {
      setIsPlaying(false);
    };
    // e.target.value = "";

  };

  return (
    <div className="div-game-section">
        <form className='justify-left' onSubmit={handleSubmit}>
          <label htmlFor="player-value">Votre réponse ?</label>
          <input name="player-value" type="int" onChange={(e) => {
              setValueUser(Number(e.target.value))
            }
          } defaultValue="0"/>
          <button type='submit'>Valider</button>
        </form>
    </div>
  )
}

interface FieldGameProps {
  elementName:string,
  isNum: boolean,
  setConfigLives:Dispatch<SetStateAction<number>>, // see parent callback 'app'
  configLives:number
}

/* Return a component that is a set of elements for configuring game,
Build div with label and input element*/
function FieldGame({elementName, isNum, setConfigLives, configLives}:FieldGameProps){
  let typeField = "normal";
  if (isNum){
    typeField = "numeric";
  }

  const inputCallback = (e:ChangeEvent<HTMLInputElement>) => { //set value for parent state 'app'
    console.log("e target value :", e.target.value);
    setConfigLives(Number(e.target.value));
  }
  
  return (
    <div className={`div_${elementName}`}>
      <div>
        <label className={`label_${elementName}`} htmlFor={`input-${elementName}`}>Vies :</label>
        <input name={`input-${elementName}`} type={typeField} defaultValue={configLives} onChange={inputCallback}/>
      </div>
    </div>
  )
}

// parentCallback is to play
// function ButtonPlay(parentCallback:(v:boolean) => void, isPlaying:boolean){
//   const handleButtonPlay = () => {
//     parentCallback(true); //refresh playing
//   }
//   return (
//     <div className='button-play-center'>
//       <button className='btn-play' onClick={handleButtonPlay}>Jouer</button>
//     </div>
//   )
// }


export default App;
