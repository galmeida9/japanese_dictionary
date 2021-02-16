import React from 'react';
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
    const fs = window.require('fs');

    let json = JSON.parse(props.itemToSearch);

    const addToWordBank = (wordData) => {
        fs.readFile('word-bank.json', function (err, data) {
            let word = {
                "kanji": wordData["slug"],
                "hira": wordData["japanese"][0]["reading"],
                "english": wordData["senses"][0]["english_definitions"][0]
            }

            if (err == null) {
                let json = JSON.parse(data);
                if (json.japanese.filter(e => e.kanji === word["kanji"]).length > 0) {
                    setError(true)
                }
                else {
                    json.japanese.push(word)
                    fs.writeFileSync('word-bank.json', JSON.stringify(json))
                    setOpen(true);
                }
            }
            else {
                fs.writeFileSync('word-bank.json', JSON.stringify({"japanese": [word]}))
                setOpen(true);
            }
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setError(false);
    };

    if (json != null && json["data"].length > 0) {
        json = json["data"]
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
                            <ListItem button onClick={() => {history.push(makeUrl(value["slug"]));}} key={value["slug"]}>
                                <ListItemText id={labelId} 
                                    primary={`${value["slug"]}`} 
                                    secondary={`${value["japanese"][0]["reading"]}`} 
                                    primaryTypographyProps={{variant: "h6"}}    
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="Add" onClick={() => {addToWordBank(value)}}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
    else if (json != null && json.meta.status == 200){
        return (
            <div className={classes.noResults}>
                <h1>No Results Found</h1>
                <p style={{fontSize:'14pt'}}>You can search in english, hiragana, katakana, kanji and in romanji</p>
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
