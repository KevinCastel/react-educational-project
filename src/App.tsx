import './App.css';
import "./index.css"


let is_playing = false;
let lives = 0;
let num_to_find = 0;


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DivManageGame />
        <ButtonGame text='Bonjour'/>
      </header>
    </div>
  );
}

function DivManageGame(){
  return (
    <div className="div_menu">
      <h1>Configuration pour le jeu</h1>
    </div>
  )
}

function ButtonGame({ text = "Start Game"}){

  return (
    <button className='bg-white p-5'>{text}</button>
  )
}

export default App;
