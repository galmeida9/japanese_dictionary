import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import WordBankContext from './WordBankContext';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    card: {
        justifyContent: "space-between",
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '22pt',
        userSelect: 'none'
    }
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Practice(props) {
    const [words, setWords] = useState([]);
    const [currWord, setCurrWord] = useState({"kanji": "", "hira": "", "english": ""});
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [correctResp, setCorrectResp] = React.useState("");
    const [response, setResponse] = React.useState("");

    const context = useContext(WordBankContext);

    const fs = window.require('fs');
    const classes = useStyles();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setError(false);
    };

    useEffect(() => {
        getWords();
    }, [])

    const getWords = async () => {
        fs.readFile('word-bank.json', function (err, data) {
            setWords(JSON.parse(data).japanese.reverse());
            getRandomWord(JSON.parse(data).japanese.reverse());
            console.log(context.state)
            // context.addValue({"kanji":"車","hira":"くるま","english":"car"})
            // console.log(context.state)
            // context.removeValue({"kanji":"花","hira":"はな","english":"flower"})
        })
    }

    const getRandomWord = (wordArray) => {
        setCurrWord(wordArray[Math.floor(Math.random() * wordArray.length)]);
    }

    const checkInput = (event) => {
        if (event.keyCode == 13) {
            if (response != "") {
                if (response == currWord.kanji) {
                    setOpen(true);
                }
                else {
                    setError(true);
                    setCorrectResp(currWord.hira)
                }
    
                getRandomWord(words);
                setResponse("");
            }
        }
    }
    
    return (
        <div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                    Correct!
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Incorrect, correct response: {correctResp}
                </Alert>
            </Snackbar>
            {words.length > 0 && currWord.kanji != "" ? (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Write the kanji bellow
                        </Typography>
                        <Typography variant="h1" component="h2">
                            {currWord.kanji}
                        </Typography>
                    </CardContent>
                    <TextField 
                        id="outlined-basic" 
                        label="Write word" 
                        variant="outlined" 
                        onKeyDown={checkInput} 
                        value={response} 
                        onChange={(e) => {setResponse(e.target.value)}}
                    />
                </Card>                
            ) : (<span/>)}
        </div>
    )
}
