import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import WordBankContext  from './components/WordBankContext'

const palletType = 'dark'
const darkTheme = createMuiTheme({
    palette: {
        type: palletType,
    }
})

const fs = window.require('fs');
const words = {"japanese": [], "highscore": 0 }

const readFile = () => {
  fs.readFile('word-bank.json', function (err, data) {
    if (err != null) {
      console.log(err);
    }
    else {
      words.japanese = JSON.parse(data).japanese;
      words.highscore = JSON.parse(data).highscore;
    }
  });
}

readFile();

const addWord = (word) => {
  words.japanese.unshift(word);
  fs.writeFileSync('word-bank.json', JSON.stringify(words));
}

const removeWord = (kanji) => {
  let wordsCopy = words.japanese;
  let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
  if (index != -1) {
    words.japanese.splice(index, 1);
    fs.writeFileSync('word-bank.json', JSON.stringify(words));
  }
}

const setHighScore = (value) => {
  words.highscore = value;
  fs.writeFileSync('word-bank.json', JSON.stringify(words));
}

ReactDOM.render(
  <BrowserRouter>
    {/* <ThemeProvider theme={darkTheme}> */}
      <WordBankContext.Provider value={{state: words, addValue: addWord, removeValue: removeWord, setScore: setHighScore}}>
      <App />
      </WordBankContext.Provider>
    {/* </ThemeProvider> */}
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
