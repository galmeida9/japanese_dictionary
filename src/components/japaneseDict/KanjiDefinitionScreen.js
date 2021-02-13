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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
        width: '88pt',
        paddingLeft: '16pt'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
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
                    {showEx ? "Hide Examples" : "Show Examples"}
                </Button>
                <Button variant="contained" color="secondary" style={{marginRight: '10pt'}} onClick={toggleStrokes}>
                    {showStrokes ? "Hide Stroke Order" : "Show Stroke Order"}
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
                        <td>{ showStrokes ? (<img id="gif" src={item.strokeOrderGifUri} className={classes.gif} />) : (<span />) }</td>
                    </tr>
                    <tr>
                        <td className={classes.strokes}>{item.strokeCount} strokes</td>
                        <td style={{paddingLeft: '22pt'}}>JLPT {item.jlptLevel}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        { JSON.stringify(item) != "{}" ? (
                            item.kunyomiExamples.map((value) => {
                                return (
                                    <td style={{width: 100 / item.kunyomiExamples.length + "%"}} key={value.example}>
                                        <Card className={classes.root} style={{height: '140pt'}}>
                                            <CardContent>
                                                <Typography variant="h5" component="h2">
                                                    {value.example}
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    {value.reading}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    {value.meaning}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </td>
                                )
                            }) 
                        ) : (<td><span /></td>)}
                    </tr>
                </tbody>
            </table>
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

