import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { lightTheme, darkTheme } from './themes';
import WordBankContext from './WordBankContext';
import DuoAPI from '../APIs/DuoAPI'
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10pt'
    },
    loading: {
        position: 'absolute',
        left: '50%',
        top: '100%',
        transform: 'translate(-50%, -100%)',
    }
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Settings (props) {
    const context = useContext(WordBankContext);
    const [state, setState] = React.useState({
        dark: context.state.dark
    });
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [totalWords, setTotalWords] = React.useState(0);
    const [totalImp, setTotalImp] = React.useState(-1);

    const classes = useStyles();
    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();

    const performLogin = (event) => {
        if (event.keyCode == 13) {
            getDuoWords()
        }
    }

    const getDuoWords = async () => {
        setUsername("");
        setPassword("");

        const duo = new DuoAPI({username: username, password: password});
        duo.login().then((response) => {
            if (response.response == "OK") {
                setOpen(true);
                setLoading(true);
                duo.getLearnedWords().then((words) => {
                    setTotalWords(words.length);
                    addDuoWords(words);
                })
            }
            else {
                setError(true);
            }
        })
    }

    const addDuoWords = async (list) => {
        let imported = 0;
        for (let i = 0; i < list.length; i++) {
            let word = list[i];
            if (!context.checkWord(word)) {
                if (word.length == 1) {
                    let data = await jisho.searchForKanji(word);
                    let item = JSON.parse(JSON.stringify(data, null, 2));
                    
                    if (item.found) {
                        imported++;
                        let newWord = {
                            "kanji": word,
                            "hira": item.kunyomi[0],
                            "english": item.meaning
                        }

                        context.addValue(newWord);
                    }
                }
                else {
                    let data = await jisho.searchForPhrase(word);
                    let item = JSON.parse(JSON.stringify(data, null, 2));
                    
                    if (item.meta.status == 200 && item.data.length > 0) {
                        imported++;
                        let newWord = {
                            "kanji": word,
                            "hira": item.data[0].japanese[0].reading,
                            "english": item.data[0].senses[0].english_definitions[0]
                        }

                        context.addValue(newWord);
                    }
                }
            }

            setProgress(i/(list.length-1)*100);
        }

        setTotalImp(imported);
        setLoading(false);
        setSuccess(true);
    }
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        event.target.checked ? props.theme(darkTheme) : props.theme(lightTheme);
        context.setTheme(event.target.checked);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setError(false);
        setSuccess(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success">
                    { success ? ("All words were imported!") : ("Login Successful") }
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="error">
                    Wrong Credentials
                </Alert>
            </Snackbar>
            <FormControl component="fieldset">
                <FormLabel component="legend">Personalization options</FormLabel>
                <FormGroup>
                    <FormControlLabel
                    control={<Switch checked={state.dark} onChange={handleChange} name="dark" color="primary" />}
                    label="Dark Mode"
                    />
                </FormGroup>
            </FormControl>
            <Divider style={{marginTop: '10pt', marginBottom: '10pt'}}/>
            <FormLabel component="legend">Get Duolingo word bank</FormLabel>
            <form className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    onKeyDown={performLogin}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={getDuoWords}
                >
                    Log In
                </Button>
            </form>
            { loading ? (
                <div style={{marginTop: '12pt'}}>
                    <FormLabel component="legend">Found {totalWords} words</FormLabel>
                    <LinearProgress variant="determinate" value={progress} style={{marginTop: '10pt'}}/>
                </div>
                ) : (<span/>) 
            }
            { totalImp != -1? (<FormLabel component="legend" style={{marginTop: '12pt'}}>Imported {totalImp} words</FormLabel>) : (<span/>) }
        </div>
    )
}
