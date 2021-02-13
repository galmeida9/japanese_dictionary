import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

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
        display: 'none'
    }
  }));

export default function KanjiDefinitionScreen(props) {
    const classes = useStyles();
    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();
    const [item, setItem] = useState({})
    const [examples, setExamples] = useState([])
    const [showEx, setShowEx] = useState(false)
    const [showStrokes, setShowStrokes] = useState(false)

    useEffect(() => {
        performSearch();
    }, [])
    
    const performSearch = async () => {
        let data = await jisho.searchForKanji(props.match.params.name);
        let data2 = await jisho.searchForExamples(props.match.params.name);

        const item = JSON.parse(JSON.stringify(data, null, 2))
        const examples = JSON.parse(JSON.stringify(data2, null, 2))
        
        setItem(item)
        setExamples(examples.results)
        
        console.log(item)
        console.log(examples.results)
    }

    const toggleExamples = () => {
        setShowEx(!showEx)
    }

    const toggleStrokes = () => {
        setShowStrokes(!showStrokes)
    }

    return (
        <div className={classes.root}>
            <div style={{float: 'right'}}>
                <Button variant="contained" color="primary" style={{marginRight: '10pt'}} onClick={toggleExamples}>
                    Show Examples
                </Button>
                <Button variant="contained" color="secondary" style={{marginRight: '10pt'}} onClick={toggleStrokes}>
                    Show Strokes
                </Button>
                <Fab color="primary" aria-label="add">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginTop: '5pt' }}>
                        <ArrowBackIcon />
                    </Link>
                </Fab>
            </div>
            <table style={{marginTop: '-10pt'}}>
                <tbody>
                    <tr>
                        <td id="kanji" className={classes.kanji}>{props.match.params.name}</td>
                        <td style={{paddingLeft: '22pt'}}>
                            <p className={classes.translation}>{item.meaning}</p>
                            <p className={classes.hiragana}>{item.kunyomi}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className={classes.strokes}>{item.strokeCount} strokes</td>
                        <td style={{paddingLeft: '22pt'}}>JLPT {item.jlptLevel}</td>
                    </tr>
                </tbody>
            </table>
            { showStrokes ? (<img id="gif" src={item.strokeOrderGifUri}/>) : (<p>hide strokes</p>) }
            { examples.length > 0 && showEx? (
                examples.map((value) => {
                    return(
                        <Accordion key={value.english}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{value.english}</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{display: 'grid'}}>
                                <Typography>Kanji: {value.kanji}</Typography>
                                <Typography>Kana: {value.kana}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })) : (
                <p>I have nothing</p>
            )}
        </div>
    )
}

