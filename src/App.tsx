import { error, timeStamp } from 'console';
import './App.css';
import "./index.css"
import { callbackify } from 'util';
import { ChangeEvent, Dispatch, JSX, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Input } from 'postcss';
import { Target } from 'inspector/promises';
import { setDefaultCACertificates } from 'tls';

//declared as module in custom.d.ts
// import HeartLife from "./heart-svgrepo-com.svg";

// import { ReactComponentElement } from 'react';
// import {ReactComponent as HeartSvg} from './heart-svgrepo-com.svg';


const MAX_SECONDS = 300;
const DEFAULT_LIVES : number = 30;

const inputStates = Object.freeze({
  IS_HIGHER : "is_higher",
  IS_LOWER : "is_lower",
  IS_EQUAL : "is_equal",
})

const gameStatements = Object.freeze({
  IS_WON:"is_won",
  IS_LOST:"is_lost",
})



function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(0);
  const [configLives, setConfigLives] = useState(DEFAULT_LIVES);
  const [numToFind, setNumToFind] = useState(0);
  const [stillSeconds, setStillSeconds] = useState(MAX_SECONDS);
  const [configStillSeconds, setConfigStillSeconds] = useState(MAX_SECONDS);
  const [lastInputValue, setLastInputValue] = useState(0);
  const [inputState, setInputState] = useState("");
  const [lastGameState, setLastGameState] = useState("none");

  useEffect(() => {
    const interval = setInterval(()=>{
        setStillSeconds(stillSeconds-1);
        if (stillSeconds < 2){
          LosingGame({setIsPlaying}, {setLastGameState});
        }
    }, 1000)
    return () => clearInterval(interval);
  }, [stillSeconds, setStillSeconds]);

  const startGame = () => {
    setIsPlaying(true);
    setNumToFind(Math.floor(Math.random()*9999));
    setLives(configLives);
    setStillSeconds(configStillSeconds);
    console.log("is playing :", isPlaying);
  }
  

  
  
  return (
    <div className={isPlaying ? "App-playing" : "App-not-playing"}>
      <header>
        <GameInterface lives={lives}
                          setConfigLives={setConfigLives} configLives={configLives}
                          setConfigGameTime={setConfigStillSeconds} configGameTime={stillSeconds}
                          isPlaying={isPlaying} gameTime={stillSeconds}
                          gameState={lastGameState}
                          startGame={startGame}
                          setLives={setLives}
                          />
      </header>
      <div className={isPlaying ? 'body-customized-playing' : "body-customized-not-playing"}>
        <InputGame numToFind={numToFind}
                    isPlaying={isPlaying}
                    setLastInput={setLastInputValue}
                    setLives={setLives}
                    lives={lives}
                    setIsPlaying={setIsPlaying}
                    setInputState={setInputState} 
                    minimumValueNumInput={10}
                    maximumValueNumInput={20}
                    setLastGameState={setLastGameState}/>
        <InputInformationParty
            isPlaying={isPlaying}
            lastInputValue={lastInputValue}
            inputState={inputState}
            />
      </div>
      <div className='App-footer'>
        <p>Produit avec Reactjs<br/>Heberger sur github.com</p>
      </div>
    </div>
  );
}



function LosingGame({setIsPlaying}:{setIsPlaying:Dispatch<SetStateAction<boolean>>},{setLastGameState}:{setLastGameState:Dispatch<SetStateAction<string>>}){
  setIsPlaying(false);
  setLastGameState(gameStatements.IS_LOST);
  
}

interface GameInterfaceProps{
  isPlaying: boolean,
  lives: number,
  gameTime: number,
  startGame: () => void,
  setLives:Dispatch<SetStateAction<number>>,
  setConfigLives:Dispatch<SetStateAction<number>>,
  configGameTime : number,
  setConfigGameTime : Dispatch<SetStateAction<number>>,
  configLives:number,
  gameState:string,
}

//Return the appropriate game menu interface for 
function GameInterface({lives, isPlaying, gameTime, startGame,
                          setConfigLives, configGameTime, setConfigGameTime, configLives,
                          gameState}:GameInterfaceProps){
  if (isPlaying) {
    return <InformationsGame liveStill={lives} timeStill={gameTime}/>
  }
  return <ConfigurationGame configLives={configLives} configGameTime={configGameTime}
                lastGameState={gameState} setConfigLives={setConfigLives}
                setConfigGameTime={setConfigGameTime} startGame={startGame}/>
}


interface InputInformationPartyProps {
  isPlaying : boolean;
  lastInputValue : number,
  inputState : string;
}

//Component for rendering game informations on input user during the game 
function InputInformationParty({isPlaying, lastInputValue, inputState}:InputInformationPartyProps){
  if (!isPlaying){
    return null;
  }
  let messageOnTheValue = "";
  // const messageOnTheValue = isInputHigherThanNumToFind?"La valeur est trop haute":"La valeur est trop basse";
  if (inputState == inputStates.IS_EQUAL){
    messageOnTheValue = "Bravo ! C'est gagné !";
  } else if (inputState == inputStates.IS_LOWER){
    messageOnTheValue = "La valeur est trop petite";
  } else if (inputState == inputStates.IS_HIGHER){
    messageOnTheValue = "La valeur est trop haute";
  }


  return (<div className='infos-party'>
    {lastInputValue!=0?<h2>Dernièrement, vous avez tapé :{lastInputValue.toString()} <br/> {messageOnTheValue}</h2> : null}
  </div>)
}

interface InformationGameProps {
  liveStill:number,
  timeStill:number,
}

/* Components for detailling during game */
function InformationsGame({liveStill, timeStill}:InformationGameProps){
  let index = 0;
  const svg_size = "14%";
  
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


interface ConfigurationGameProps{
  startGame:()=>void,
  lastGameState:string,
  setConfigLives:Dispatch<SetStateAction<number>>,
  configLives:number,
  setConfigGameTime:Dispatch<SetStateAction<number>>,
  configGameTime:number,
}

/* Return a component witch is a div with fields stuffs 
to configure game*/
function ConfigurationGame({startGame,
                      lastGameState,
                      setConfigLives,
                      configLives,
                      setConfigGameTime,
                      configGameTime}:ConfigurationGameProps)
{
  const handleSubmitPlay = (e:SyntheticEvent) => {
    e.preventDefault();
    // setLives(configLives);
    startGame();
  };

  const [doesUserAlreadyPlayed, setDoesUserAlreadyPlayed] = useState(false);
  const [messageGameState, setMessageGameState] = useState("");


  useEffect(() =>{
    if (lastGameState != "none"){
      setDoesUserAlreadyPlayed(true);
      if (lastGameState == gameStatements.IS_WON){
        setMessageGameState("Félicitation, la dernière partie est gagnée!");
      } else {
        setMessageGameState("Navré que la partie dernière n'est pas été gagnée");
      }
    };
  },
  [setDoesUserAlreadyPlayed, setMessageGameState]);

  return (
    <div className="div-menu">
      <form className='space-evenly' onSubmit={startGame}>
        <h1>Configuration pour le jeu</h1>
        <FielConfigGame elementName='life' labelText={"Vie :"}
              isNum={true} setConfigValue={setConfigLives} configValue={configLives}/>
        
        <FielConfigGame elementName='time' labelText={"Temps (secs) :"}
                isNum={true} setConfigValue={setConfigGameTime} configValue={configGameTime}/>
        
        <div className='div-config-game-submit'>
          <button className='btn-play'>Jouer</button>
        </div>
        {doesUserAlreadyPlayed == true ? <h3 className={lastGameState == gameStatements.IS_WON ? 'inform-won-game' : 'inform-lose-game'}>
                                          {messageGameState}</h3> : null}
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
  setIsPlaying:Dispatch<SetStateAction<boolean>>,
  setInputState:Dispatch<SetStateAction<string>>,
  minimumValueNumInput:number,
  maximumValueNumInput:number,
  setLastGameState:Dispatch<SetStateAction<string>>,
}

// Input with button and label as one Component for the game
function InputGame({numToFind,isPlaying, setLastInput, setLives, lives, setIsPlaying,
          setInputState, minimumValueNumInput, maximumValueNumInput, setLastGameState}:InputGameProps)
{
  const [valueUser, setValueUser] = useState(0);

  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault();
      if (!isPlaying){
      // alert("Pas encore en jeu..!")
      return;
    }

    setLastInput(valueUser);
    
    const loseLife = boolToInt(valueUser!=numToFind);
    if (loseLife == 1){
      setLives(lives-1);
      if (lives == 1){
        setIsPlaying(false);
        setLastGameState(gameStatements.IS_LOST);
        console.log("perdu");
      };
    }


    if (valueUser == numToFind){
      setIsPlaying(false);
      setLastGameState(gameStatements.IS_WON);
    } else if (valueUser > numToFind){
      setInputState(inputStates.IS_HIGHER);
    } else if (valueUser < numToFind){
      setInputState(inputStates.IS_LOWER);
    }
  };

  return (
    <div id="answer" className="div-game-section">
        <form className='justify-left' onSubmit={handleSubmit}>
          <label htmlFor="answer" aria-label="Votre réponse">Votre réponse ?</label>
          <input name="player-value" aria-label='your answer' type="int" autoComplete='off' min={minimumValueNumInput} max={maximumValueNumInput} onChange={(e) => {
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
  setConfigValue:Dispatch<SetStateAction<number>>, // see parent callback 'app'
  configValue:number,
  labelText:string
}

/* Return a component that is a set of elements for configuring game,
Build div with label and input element*/
function FielConfigGame({elementName, isNum, setConfigValue, configValue, labelText}:FieldGameProps){
  let typeField = "normal";
  if (isNum){
    typeField = "numeric";
  }

  const inputCallback = (e:ChangeEvent<HTMLInputElement>) => { //set value for parent state 'app'
    console.log("e target value :", e.target.value);
    setConfigValue(Number(e.target.value));
  }
  
  return (
    <div className={`div-config-game`}>
      <div>
        <label className={`label_${elementName}`} htmlFor={`input-${elementName}`}>{labelText}</label>
        <input name={`input-${elementName}`} type={typeField} defaultValue={configValue} onChange={inputCallback}/>
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
