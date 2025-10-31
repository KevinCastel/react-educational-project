import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { exec } from 'child_process';

//Config game intergration test

test('change_game_time', ()=> {
  render(<App/>);

  const value = 10;
  const inputTime = screen.getByDisplayValue(300);

  fireEvent.change(inputTime, {
    target:{
      value
    }
  });

  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
})

test('change_lives', () => {
  render(<App/>);

  const value = 40;

  const inputLife = screen.getByDisplayValue(30);
  fireEvent.change(inputLife, {
    target : {
      value
    }
  });

  expect(screen.getByDisplayValue(value)).toBeInTheDocument();

});


// Game Integratating Tests
test('defaite_plus_de_temps', () => {
  render(<App/>);

  const value = 0;
  const inputTime = screen.getByDisplayValue(300);

  fireEvent.change(inputTime, {
    object :{
      value
    }
  });

  const buttonPlay = screen.getByText("Jouer");
  fireEvent.click(buttonPlay);

  
  
  expect(screen.getByDisplayValue("Navré que la partie dernière n'est pas été gagnée")).toBeInTheDocument();
  
})


test('défaite_plus_de_vie', () => {
  render(<App />);

  const changeLife = () => {
    const value = 1;

    const inputLife = screen.getByDisplayValue(30);
      fireEvent.change(inputLife, {
        target:{
          value
        }
      })
  };

  const changeAnswer = () => {
    const inputValue = screen.getByDisplayValue(0);
    const value = '2';
    fireEvent.change(inputValue, {
      target: {
        value
      }
    });
  };


  changeLife();
  changeAnswer();


  const buttonPlay = screen.getByText("Jouer");
  fireEvent.click(buttonPlay);



  const submitAnswer = screen.getByText("Valider");
  fireEvent.click(submitAnswer);

  expect(screen.getByText("Navré que la partie dernière n'est pas été gagnée")).toBeInTheDocument();

});


test('victoire', () => {
  render(<App />);

  const buttonPlay = screen.getByText("Jouer");
  fireEvent.click(buttonPlay);

  const inputValue = screen.getByDisplayValue(0);
  const value = '30';
  fireEvent.change(inputValue, {
    target: {
      value
    }
  });

  const submitAnswer = screen.getByText("Valider");
  fireEvent.click(submitAnswer);

  // expect(screen.findByText('Félicitation, la dernière partie est gagnée!')).toBeInTheDocument();
  expect(screen.getByText('Félicitation, la dernière partie est gagnée!')).toBeInTheDocument();

});
