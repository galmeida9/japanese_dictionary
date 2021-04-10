import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import WordBankContext from './WordBankContext';
import Button from '@material-ui/core/Button';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';

export default function FlashCards(props) {
    const [currWord, setCurrWord] = React.useState({ "kanji": "", "hira": "", "english": "" });
    const [reload, setReload] = React.useState(true);
    const [flip, setFlip] = React.useState(false);

    const classes = useStyles();
    const context = useContext(WordBankContext);
    const history = useHistory();

    useEffect(() => {
        setReload(false);
        if (context.state.japanese.length > 0 && currWord.kanji == "") {
            getRandomWord();
        }

        window.addEventListener('keydown', manageKeyPress);

        //remove listener
        return () => {
            window.removeEventListener('keydown', manageKeyPress);
        };
    }, [reload])

    const getRandomWord = () => {
        let list = context.state.japanese;

        if (Math.random() > 0.7 && context.state.wrong.length > 0) {
            list = context.state.wrong;
        }

        let index = Math.floor(Math.random() * list.length);
        setCurrWord(list[index]);

        return list[index];
    }

    const makeUrl = (name) => {
        if (name.length == 1) {
            return "/kanjiDefinition/" + name
        }
        else {
            return "/definition/" + name
        }
    }

    const wrongWord = () => {
        setFlip(false);

        if (!context.checkWrong(currWord.kanji)) {
            context.addWrong(currWord);
        }

        getRandomWord();
        setReload(true);
    }

    const rightWord = () => {
        setFlip(false);

        if (context.checkWrong(currWord.kanji)) {
            context.removeWrong(currWord.kanji);
        }

        getRandomWord();
        // reload event listener
        setReload(true);
    }

    const manageKeyPress = (event) => {
        switch (event.keyCode) {
            // space bar
            case 32:
                setFlip(prevState => !prevState);
                break;
            // left arrow
            case 37:
                wrongWord();
                break;
            // right arrow
            case 39:
                rightWord()
                break;
            default:
                break;
        }
    }

    const buttons = () => {
        return (
            <div>
                <Tooltip title="<- arrow key" placement="top">
                    <IconButton style={{ position: 'absolute', bottom: '0', left: '5%', color: '#e91e63' }} onClick={() => wrongWord()}>
                        <CancelIcon style={{ width: 60, height: 60 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="space bar" placement="top">
                    <Button variant="contained" color="primary" onClick={() => { setFlip(true); }} style={{ marginTop: '46pt' }}>
                        Check Meaning
                </Button>
                </Tooltip>
                <Tooltip title="-> arrow key" placement="top">
                    <IconButton style={{ position: 'absolute', bottom: '0', right: '5%', color: '#4caf50' }} onClick={() => rightWord()}>
                        <CheckCircleIcon style={{ width: 60, height: 60 }} />
                    </IconButton>
                </Tooltip>
            </div>
        );
    }

    return (
        <div>
            {currWord != null && currWord.kanji != "" ? (
                <div>
                    <Flippy
                        flipOnHover={false}
                        flipOnClick={false}
                        isFlipped={flip}
                        flipDirection="horizontal"
                        style={{
                            justifyContent: "space-between",
                            textAlign: 'center',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '22pt',
                            userSelect: 'none',
                            width: '500pt',
                            height: '300pt'
                        }}
                    >
                        {currWord.kanji.length < 8 ? (
                            <FrontSide style={{ fontSize: '50pt', padding: '0', paddingTop: '90pt' }}>
                                {currWord.kanji}
                                {buttons()}
                            </FrontSide>
                        ) : (
                                <FrontSide style={{ fontSize: '40pt', padding: '0', paddingTop: '90pt' }}>
                                    {currWord.kanji}
                                    {buttons()}
                                </FrontSide>
                            )}
                        <BackSide style={{ fontSize: '50pt', padding: '0', paddingTop: '50pt' }}>
                            {<Typography variant="h3" component="h2">
                                {currWord.hira}
                            </Typography>}
                            <Typography variant="h3" component="h2" style={{ marginTop: '20pt' }}>
                                {currWord.english}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => { history.push(makeUrl(currWord.kanji)); }}>
                                Check Definition
                            </Button>
                            <Tooltip title="space bar" placement="top">
                                <Button variant="contained" color="secondary" onClick={() => { setFlip(false); }} style={{ marginLeft: '10pt' }}>
                                    Go Back
                                </Button>
                            </Tooltip>
                        </BackSide>
                    </Flippy>
                </div>
            ) : (
                    <div>
                        <h1 className={classes.noWords} style={{ width: '100%' }}>Add words to your word bank to start practicing</h1>
                    </div>
                )}
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    noWords: {
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
}));
