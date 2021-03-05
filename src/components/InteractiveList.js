import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import WordBankContext from './WordBankContext';
import DoneIcon from '@material-ui/icons/Done';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    noResults: {
        textAlign: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    wordBank: {
        backgroundColor: "#4caf50 !important",
        marginRight: '0pt',
        userSelect: 'none'
    },
    loading: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const makeUrl = (name) => {
    if (name.length == 1) {
        return "/kanjiDefinition/" + name
    }
    else {
        return "/definition/" + name
    }
}

export default function CheckboxListSecondary(props) {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);

    const context = useContext(WordBankContext);

    let json = JSON.parse(props.itemToSearch);

    const addToWordBank = (wordData) => {
        let word = {
            "kanji": wordData["slug"],
            "hira": wordData["japanese"][0]["reading"],
            "english": wordData["senses"][0]["english_definitions"][0]
        }

        if (context.state.japanese.filter(e => e.kanji === word["kanji"]).length > 0) {
            setError(true);
        }
        else {
            context.addValue(word);
            setOpen(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setError(false);
    };

    if (json != null && json["data"].length > 0 && !props.loadingAnimation) {
        json = json["data"];
        return (
            <div>
                <List dense className={classes.root}>
                    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <Alert onClose={handleClose} severity="success">
                            Added word to Word Bank
                        </Alert>
                    </Snackbar>
                    <Snackbar open={error} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <Alert onClose={handleClose} severity="error">
                            Word already in Word Bank
                        </Alert>
                    </Snackbar>
                    {json.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                            <ListItem button onClick={() => {history.push(makeUrl(value["slug"].replace("-1", "")));}} key={value["slug"]}>
                                <ListItemText id={labelId} 
                                    primary={`${value["slug"].replace("-1", "")}`} 
                                    secondary={`${value["japanese"][0]["reading"]}`} 
                                    primaryTypographyProps={{variant: "h6"}}    
                                />
                                <ListItemSecondaryAction>
                                    {context.checkWord(value["slug"]) ? (
                                        <Chip
                                            label="In Word Bank"
                                            color="primary"
                                            classes={{colorPrimary: classes.wordBank}}
                                            onDelete={() => {}}
                                            deleteIcon={<DoneIcon />}
                                        />
                                        ) : (
                                            <IconButton edge="end" aria-label="Add" onClick={() => {addToWordBank(value)}}>
                                                <AddIcon />
                                            </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
    else if (json != null && json.meta.status == 200 && !props.loadingAnimation){
        return (
            <div className={classes.noResults}>
                <h1>No Results Found</h1>
                <p style={{fontSize:'14pt'}}>You can search in english, hiragana, katakana, kanji and in romanji</p>
            </div>
        )
    }
    else if (props.loadingAnimation) {
        return (
            <div className={classes.loading}>
                <CircularProgress />
            </div> 
        )
    }
    else {
        return (
            <div>
                <h1 className={classes.noResults} style={{width: '100%'}}>Search something in the search bar :)</h1>
            </div>
        )
    }
}
