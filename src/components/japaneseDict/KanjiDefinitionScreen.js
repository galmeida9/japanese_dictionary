import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DoneIcon from '@material-ui/icons/Done';
import Chip from '@material-ui/core/Chip';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import WordBankContext from '../WordBankContext';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      padding: "16pt",
      paddingTop: "10pt"
    },
    kanji: {
        fontSize: '64pt'
    },
    strokes: {
        textAlign: 'center'
    },
    translation: {
        margin: '0pt',
        fontSize: '24pt'
    },
    hiragana: {
        margin: '0pt',
        fontSize: '16pt'
    },
    gif: {
        width: '78pt',
    },
    wordBank: {
        backgroundColor: "#4caf50 !important",
        marginRight: '10pt', 
        userSelect: 'none'
    },
    addToWordBank: {
        backgroundColor: "#ff9800 !important",
        marginRight: '10pt', 
        userSelect: 'none'
    },
    card: {
        justifyContent: "space-between",
        textAlign: 'center'
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function KanjiDefinitionScreen(props) {
    const classes = useStyles();
    const [item, setItem] = useState({});
    const [examples, setExamples] = useState([]);
    const [showEx, setShowEx] = useState(false);
    const [showStrokes, setShowStrokes] = useState(false);
    const [wordBank, setWordBank] = useState(false);
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    const context = useContext(WordBankContext);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    useEffect(() => {
        performSearch();
        getWords();
    }, [])
    
    const performSearch = async () => {
        let data = await jisho.searchForKanji(props.match.params.name);
        let data2 = await jisho.searchForExamples(props.match.params.name);

        const item = JSON.parse(JSON.stringify(data, null, 2));
        const examples = JSON.parse(JSON.stringify(data2, null, 2));
        
        setItem(item);
        setExamples(examples.results);
    }

    const toggleExamples = () => {
        setShowEx(!showEx);
    }

    const toggleStrokes = () => {
        setShowStrokes(!showStrokes);
        let kanji = document.getElementById("kanji");
        kanji.style.display = kanji.style.display == "none" ? "block" : "none";
    }

    const getWords = async () => {
        if (context.state.japanese.filter(el => props.match.params.name == el.kanji).length > 0) {
            setWordBank(true);
        }
    }

    const makeExampleCard = (example) => {
        return (
            <Grid item component={Card} xs className={classes.card} key={example.example}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {example.example}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {example.reading}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {example.meaning}
                    </Typography>
                </CardContent>
            </Grid>
        )
    }

    const addToWordBank = () => {
        let word = {
            "kanji": props.match.params.name,
            "hira": item.kunyomi[0],
            "english": item.meaning
        }

        context.addValue(word);
        setOpen(true);
        setWordBank(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                    Added word to Word Bank
                </Alert>
            </Snackbar>
            <div style={{float: 'right'}}>
                {wordBank ? (
                    <Chip
                        label="In Word Bank"
                        color="primary"
                        classes={{colorPrimary: classes.wordBank}}
                        onDelete={() => {}}
                        deleteIcon={<DoneIcon />}
                    />
                ) : (
                    <Chip
                        label="Add to Word Bank"
                        color="primary"
                        classes={{colorPrimary: classes.addToWordBank}}
                        onDelete={() => {addToWordBank()}}
                        deleteIcon={<AddIcon />}
                    />
                )}
                <Button variant="contained" color="primary" style={{marginRight: '10pt'}} onClick={toggleExamples}>
                    {showEx ? "Hide Examples" : "Show Examples"}
                </Button>
                <Button variant="contained" color="secondary" style={{marginRight: '10pt'}} onClick={toggleStrokes}>
                    {showStrokes ? "Hide Stroke Order" : "Show Stroke Order"}
                </Button>
                <Fab color="primary" aria-label="add">
                    <ArrowBackIcon onClick={() => {history.goBack()}}/>
                </Fab>
            </div>
            <table style={{marginTop: '-10pt'}}>
                <tbody>
                    <tr>
                        <td id="kanji" className={classes.kanji}>{props.match.params.name}</td>
                        { showStrokes ? (<td><img id="gif" src={item.strokeOrderGifUri} className={classes.gif} /></td>) : (<td style={{display: 'none'}}><span/></td>) }
                        <td style={{paddingLeft: '22pt'}}>
                            <p className={classes.translation}>{item.meaning}</p>
                            { item.kunyomi != null ? (<p className={classes.hiragana}>{item.kunyomi[0]}</p>) : (<p/>) }
                        </td>
                    </tr>
                    <tr>
                        <td className={classes.strokes}>{item.strokeCount} strokes</td>
                        <td style={{paddingLeft: '22pt'}}>JLPT {item.jlptLevel}</td>
                    </tr>
                </tbody>
            </table>
            <Grid container alignItems="stretch">
                { JSON.stringify(item) != "{}" ? (
                    item.kunyomiExamples.map((value, index) => {
                        if (index < 4) {
                            return (makeExampleCard(value))
                        }
                    }) 
                ) : (<span />)}
            </Grid>
            <Grid container alignItems="stretch">
                { JSON.stringify(item) != "{}" ? (
                    item.kunyomiExamples.map((value, index) => {
                        if (index >= 4 && index < 8) {
                            return (makeExampleCard(value))
                        }
                    }) 
                ) : (<span />)}
            </Grid>
            { examples.length > 0 && showEx? (<h1>Examples</h1>) : (<span />) }
            { examples.length > 0 && showEx? (
                examples.map((value) => {
                    return (
                        <Accordion key={value.english}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{value.english}</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{display: 'grid'}}>
                                <Typography><b>Kanji:</b> {value.kanji}</Typography>
                                <Typography><b>Kana:</b> {value.kana}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })) : (<span />)}
        </div>
    )
}

