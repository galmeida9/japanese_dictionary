import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import WordBankContext from './WordBankContext';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';

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
    },
    highScore: {
        width: '162pt',
        textAlign: 'center',
        margin: '10pt'
    },
    score: {
        width: '162pt',
        textAlign: 'center',
        margin: '10pt',
        right: '0',
        position: 'absolute'
    }
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Practice(props) {
    const [currWord, setCurrWord] = useState({"kanji": "", "hira": "", "english": ""});
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [correctResp, setCorrectResp] = React.useState("");
    const [response, setResponse] = React.useState("");
    const [highScore, setHightScore] = React.useState(0);
    const [score, setScore] = React.useState(0);
    const [wordList, setWordList] = React.useState([]);
    const [finished, setFinished] = React.useState(false);

    const context = useContext(WordBankContext);
    const classes = useStyles();

    useEffect(() => {
        copyList();
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setError(false);
    };

    const copyList = () => {
        let list = [];
        for (var i = 0; i < context.state.japanese.length; i++) {
            list.push(context.state.japanese[i]);
        }

        setHightScore(context.state.highscore);
        setWordList(list);
        getRandomWord(list);
    }

    const getRandomWord = (list) => {
        let index = Math.floor(Math.random() * list.length);
        setCurrWord(list[index]);
        
        if (list.length > 2) {
            list.splice(index, 1);
            setWordList(list);
        }
        else if (list.length == 2) {
            list = [list[list.length - 1 - index]]
            setWordList(list);
        }
        else if (list.length == 1) {
            list = []
            setWordList(list);
        }
    }

    const checkInput = (event) => {
        if (event.keyCode == 13) {
            if (response != "") {
                if ((currWord.kanji != currWord.hira && response == currWord.kanji) 
                || (currWord.kanji == currWord.hira && response == currWord.english.split(" ")[0])) {
                    let s = score + 1
                    setScore(s);
                    setOpen(true);

                    if (s > highScore) {
                        setHightScore(s);
                        context.setScore(s);
                    }
                }
                else {
                    setError(true);
                    if (currWord.kanji == currWord.hira) {
                        setCorrectResp(currWord.english);
                    }
                    else {
                        setCorrectResp(currWord.hira);
                    }
                }
    
                if (wordList.length > 0) {
                    getRandomWord(wordList);
                }
                else {
                    setFinished(true);
                }
                setResponse("");
            }
        }
    }

    const retry = () => {
        copyList();
        setScore(0);
        setFinished(false);
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
            <div style={{display: 'flex'}}>
                <Card className={classes.highScore}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            HighScore: {highScore}
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.score}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Score: {score}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            {currWord != null && currWord.kanji != "" && !finished ? (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {currWord.kanji != currWord.hira ? ("Write the kanji bellow") : ("Write the meaning in english bellow")}
                        </Typography>
                        { currWord.kanji != currWord.hira ? (
                            <Typography variant="h1" component="h2">
                                {currWord.kanji}
                            </Typography>
                        ) : (
                            <Typography variant="h2" component="h2">
                                {currWord.kanji}
                            </Typography>
                        ) }
                    </CardContent>
                    <TextField 
                        id="outlined-basic" 
                        label="Write answer" 
                        variant="outlined" 
                        onKeyDown={checkInput} 
                        value={response} 
                        onChange={(e) => {setResponse(e.target.value)}}
                    />
                </Card>                
            ) : (<span/>)}
            { finished ? (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h3" component="h2">
                            Practice Complete!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            style={{marginLeft: 'auto', marginRight: 'auto'}} 
                            onClick={retry}>
                            Retry
                        </Button>
                    </CardActions>
                </Card>     
            ) : (<span/>) }
        </div>
    )
}
