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
import WordBankContext from './WordBankContext';
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
    kanjiBig: {
        fontSize: '64pt'
    },
    kanjiSmall: {
        fontSize: '36pt'
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
        width: '88pt',
        paddingLeft: '16pt'
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

export default function DefinitionScreen(props) {
    const classes = useStyles();
    const [item, setItem] = useState({});
    const [examples, setExamples] = useState([]);
    const [showEx, setShowEx] = useState(false);
    const [jlpt, setJlpt] = useState("");
    const [wordBank, setWordBank] = useState(false);
    const history = useHistory();
    const [open, setOpen] = React.useState(false);

    const context = useContext(WordBankContext);

    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    useEffect(() => {
        performSearch();
        getWords();
    }, [])
    
    const performSearch = async () => {
        let data = await jisho.searchForPhrase(props.match.params.name);
        let data2 = await jisho.searchForExamples(props.match.params.name);

        const item = JSON.parse(JSON.stringify(data, null, 2));
        const examples = JSON.parse(JSON.stringify(data2, null, 2));

        setItem(item.data[0]);
        setExamples(examples.results);
        if (item.data[0].jlpt.length > 0) {
            setJlpt(item.data[0].jlpt[0].toUpperCase());
        }
    }

    const toggleExamples = () => {
        setShowEx(!showEx);
    }

    const getWords = async () => {
        if (context.state.japanese.filter(el => props.match.params.name == el.kanji).length > 0) {
            setWordBank(true);
        }
    }

    const addToWordBank = () => {
        let word = {
            "kanji": props.match.params.name,
            "hira": item.japanese[0].reading,
            "english": item.senses[0].english_definitions[0]
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

    const makeCard = (value) => {
        return (
            <Grid item component={Card} xs className={classes.card} key={value.english_definitions}>
                <CardContent>
                    <Typography className={classes.pos} color="textSecondary">
                        {value.parts_of_speech}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {value.english_definitions.join(", ")}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {value.meaning}
                    </Typography>
                </CardContent>
            </Grid>
        )
    }

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
                <Fab color="primary" aria-label="add">
                    <ArrowBackIcon onClick={() => {history.goBack()}}/>
                </Fab>
            </div>
            { JSON.stringify(item) != "{}" ? (
                <table style={{marginTop: '-10pt'}}>
                    <tbody>
                        <tr>
                            <td 
                            id="kanji" 
                            className={item.slug.match("[a-zA-Z0-9]") ? classes.kanjiSmall : classes.kanjiBig}>
                                {props.match.params.name}
                            </td>
                            <td style={{paddingLeft: '22pt'}}>
                                <p className={classes.translation}>{item.senses[0].english_definitions[0]}</p>
                                <p className={classes.hiragana}>{item.japanese[0].reading}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{paddingLeft: '22pt'}}>{jlpt}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (<span/>) }
            <Grid container alignItems="stretch">
                { JSON.stringify(item) != "{}" ? (
                    item.senses.map((value, index) => {
                        if (index < 4) {
                            return (makeCard(value))
                        }
                    })
                ) : (<span />)}
            </Grid>
            <Grid container alignItems="stretch">
                { JSON.stringify(item) != "{}" ? (
                    item.senses.map((value, index) => {
                        if (index >= 4 && index < 8) {
                            return (makeCard(value))
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

