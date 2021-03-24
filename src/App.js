import React, { useEffect } from 'react';
import SearchAppBar from './components/SearchAppBar';
import Toolbar from '@material-ui/core/Toolbar';
import JapaneseScreen from './components/JapaneseScreen';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme, darkTheme } from './components/themes';
import CssBaseline from "@material-ui/core/CssBaseline";
import WordBankContext from './components/WordBankContext';

export default function App(props) {
	const [searchValue, setSearchValue] = React.useState(null);
	const [currTheme, setCurrTheme] = React.useState(lightTheme);
	const [loading, setLoading] = React.useState(null);
	const [words, setWords] = React.useState({ "japanese": [], "highscore": 0, "dark": false, "wrong": [] });

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

				if (parsedJson.hasOwnProperty("japanese")) words.japanese = parsedJson.japanese;
				if (parsedJson.hasOwnProperty("highscore")) words.highscore = parsedJson.highscore;
				if (parsedJson.hasOwnProperty("dark")) words.dark = parsedJson.dark;
				if (parsedJson.hasOwnProperty("wrong")) words.wrong = parsedJson.wrong;

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

	const addWrongWord = (word) => {
		words.wrong.unshift(word);
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

	const removeWrongWord = (kanji) => {
		let wordsCopy = words.wrong;
		let index = wordsCopy.map(e => e.kanji).indexOf(kanji)
		if (index != -1) {
			words.wrong.splice(index, 1);
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

	const checkWrongWords = (kanji) => {
		if (words.wrong.filter(el => kanji == el.kanji).length > 0) {
			return true;
		}

		return false;
	}

	const importWords = (newWords) => {
		words.japanese = newWords.japanese;
		words.highscore = newWords.highscore;
		words.dark = newWords.dark;
	}

	return (
		<WordBankContext.Provider
			value={
				{
					state: words,
					addValue: addWord,
					addWrong: addWrongWord,
					removeValue: removeWord,
					removeWrong: removeWrongWord,
					setScore: setHighScore,
					setTheme: setTheme,
					checkWord: checkWordBank,
					checkWrong: checkWrongWords,
					upload: importWords
				}
			}>
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