import { error } from 'console';
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

/* Return a component witch is a div with fields stuffs 
to configure game*/
function DivManageGame(){
  return (
    <div className="div_menu">
      <h1>Configuration pour le jeu</h1>
      <FieldGame element_name='life' />
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

  return (
    <div className={div_name}>
      <div>
        <label>Lifes :</label>
        <input type={type_field}/>
      </div>
    </div>
  )
}

/* Return a button as component, you have to specify the text's component */
function ButtonGame({ text = ""}){
  if (text.length == 0){
    throw Error("No text provided for the button element")
  }
  return (
    <button className='bg-white p-5'>{text}</button>
  )
}

export default App;
