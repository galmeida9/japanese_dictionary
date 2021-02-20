import React, { useState, useEffect } from 'react';
import SearchAppBar from './components/SearchAppBar';
import Toolbar from '@material-ui/core/Toolbar';
import JapaneseScreen from './components/japaneseDict/JapaneseScreen';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme, darkTheme } from './components/themes';
import CssBaseline from "@material-ui/core/CssBaseline";
import WordBankContext from './components/WordBankContext';

export default function App (props) {
  const [searchValue, setSearchValue] = React.useState(null);
  const [currTheme, setCurrTheme] = React.useState(lightTheme);
  const [loading, setLoading] = React.useState(null);
  const [words, setWords] = React.useState({"japanese": [], "highscore": 0, "dark": false });

  const fs = window.require('fs');

  useEffect(() => {
    readFile();
  }, [])

  const readFile = () => {
    fs.readFile('word-bank.json', function (err, data) {
      if (err != null) {
        console.log(err);
      }
      else {
        let parsedJson = JSON.parse(data);
        words.japanese = parsedJson.japanese;
        words.highscore = parsedJson.highscore;
        words.dark = parsedJson.dark;
        if (parsedJson.dark) {
          setCurrTheme(darkTheme);
        }
      }
    });
  }

  const addWord = (word) => {
    words.japanese.unshift(word);
    fs.writeFileSync('word-bank.json', JSON.stringify(words));
    setWords(words);
  }

  const removeWord = (kanji) => {
    let wordsCopy = words.japanese;
    let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
    if (index != -1) {
      words.japanese.splice(index, 1);
      fs.writeFileSync('word-bank.json', JSON.stringify(words));
      setWords(words);
    }
  }

  const setHighScore = (value) => {
    words.highscore = value;
    fs.writeFileSync('word-bank.json', JSON.stringify(words));
    setWords(words);
  }

  const setTheme = (bool) => {
    words.dark = bool;
    fs.writeFileSync('word-bank.json', JSON.stringify(words));
    setWords(words);
  }

  const checkWordBank = (kanji) => {
    if (words.japanese.filter(el => kanji == el.kanji).length > 0) {
        return true;
    }

    return false;
  }

  return (
    <WordBankContext.Provider 
      value={{state: words, addValue: addWord, removeValue: removeWord, setScore: setHighScore, setTheme: setTheme, checkWord: checkWordBank}}
      >
      <ThemeProvider theme={currTheme}>
        <CssBaseline />
        <div className="App">
            <SearchAppBar SearchData={setSearchValue} loading={setLoading} />
            <Toolbar />
            <JapaneseScreen itemToSearch={searchValue} theme={setCurrTheme} loadingAnimation={loading} />
        </div>
      </ThemeProvider>
    </WordBankContext.Provider>
  );
}