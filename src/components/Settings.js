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
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10pt',
        userSelect: 'none'
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

export default function Settings(props) {
    const context = useContext(WordBankContext);
    const [state, setState] = React.useState({
        dark: context.state.dark
    });
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [totalWords, setTotalWords] = React.useState(0);
    const [totalImp, setTotalImp] = React.useState(-1);
    const [openBtn, setOpenBtn] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [errorMessage, setErrorMessage] = React.useState("Wrong Credentials");
    const [successMessage, setSuccessMessage] = React.useState("Login Successful");

    const classes = useStyles();
    const JishoApi = require('unofficial-jisho-api');
    const jisho = new JishoApi();
    const fs = window.require('fs');

    const performLogin = (event) => {
        if (event.keyCode == 13) {
            getDuoWords()
        }
    }

    const getDuoWords = async () => {
        const duo = new DuoAPI({ username: username, password: password });
        setUsername("");
        setPassword("");

        duo.login().then((response) => {
            if (!response.hasOwnProperty("failure")) {
                setSuccessMessage("Login Successful");
                setOpen(true);
                setLoading(true);
                duo.getLearnedWords().then((words) => {
                    setTotalWords(words.length);
                    addDuoWords(words);
                })
            }
            else {
                setErrorMessage("Wrong Credentials");
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
                            "english": item.meaning,
                            "jlpt": item.jlptLevel
                        }

                        context.addValue(newWord);
                    }
                }
                else {
                    let data = await jisho.searchForPhrase(word);
                    let items = JSON.parse(JSON.stringify(data, null, 2));

                    if (items.meta.status == 200 && items.data.length > 0) {
                        imported++;
                        let item = items.data[0];
                        let newWord = {
                            "kanji": word,
                            "hira": item.japanese[0].reading,
                            "english": item.senses[0].english_definitions[0],
                            "jlpt": item.jlpt.length > 0 ? item.jlpt[0].split("jlpt-")[1].toUpperCase() : "Unknown"
                        }

                        context.addValue(newWord);
                    }
                }
            }

            setProgress(i / (list.length - 1) * 100);
        }

        setSuccessMessage("All words were imported");
        setTotalImp(imported);
        setLoading(false);
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
    };

    //-----------------------------------------//
    // Import Export Button functions //
    //-----------------------------------------//

    const options = ['Import Words', 'Export Words'];

    const handleFile = ({ target }) => {
        if (target.files.length > 0) {
            //ISSUE: For now it only works with directories with at least one file
            if (selectedIndex == 1) {
                var path = "";
                const arrayPath = target.files[0].path.split("\\")

                for (var i = 0; i < arrayPath.length-1; i++) {
                    path += arrayPath[i] + "\\";
                }

                fs.writeFileSync(path + "word-bank.json", JSON.stringify(context.state));
                setSuccessMessage("File Exported");
                setOpen(true);
            }
            else {
                fs.readFile(target.files[0].path, function (err, data) {
                    if (err != null) {
                        console.log(err);
                        setErrorMessage("Could not read File");
                        setError(true);
                    }
                    else {
                        let parsedJson = JSON.parse(data);
                        if (!parsedJson.hasOwnProperty("japanese") || !parsedJson.hasOwnProperty("highscore") || !parsedJson.hasOwnProperty("dark")) {
                            setErrorMessage("Invalid JSON");
                            setError(true);
                        }
                        else {
                            context.upload(parsedJson);
                            fs.writeFileSync('word-bank.json', JSON.stringify(parsedJson));
                            setSuccessMessage("File Imported");
                            setOpen(true);
                        }
                    }
                });
            }
        }
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpenBtn(false);
    };

    const handleToggleBtn = () => {
        setOpenBtn((prevOpen) => !prevOpen);
    };

    const handleCloseBtn = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenBtn(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
            <div className={classes.root}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Personalization options</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={state.dark} onChange={handleChange} name="dark" color="primary" />}
                            label="Dark Mode"
                        />
                    </FormGroup>
                </FormControl>
                <Divider style={{ marginTop: '10pt', marginBottom: '10pt' }} />
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
                        onChange={(e) => { setUsername(e.target.value) }}
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
                        onChange={(e) => { setPassword(e.target.value) }}
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
                {loading ? (
                    <div style={{ marginTop: '12pt' }}>
                        <FormLabel component="legend">Found {totalWords} words</FormLabel>
                        <LinearProgress variant="determinate" value={progress} style={{ marginTop: '10pt' }} />
                    </div>
                ) : (<span />)
                }
                {totalImp != -1 ? (<FormLabel component="legend" style={{ marginTop: '12pt' }}>Imported {totalImp} words</FormLabel>) : (<span />)}
                <Divider style={{ marginTop: '10pt', marginBottom: '10pt' }} />
                <FormLabel component="legend">Import / Export Words</FormLabel>
                <input type="file"
                    id="fileUploadButton"
                    hidden
                    accept="application/JSON"
                    onChange={handleFile}
                />
                <input type="file"
                    id="fileSaveButton"
                    webkitdirectory=""
                    hidden
                    onChange={handleFile}
                />
                <Grid container direction="column" style={{ marginTop: '10pt' }}>
                    <Grid item xs={12}>
                        <label htmlFor={selectedIndex == 1 ? 'fileSaveButton' : 'fileUploadButton'}>
                            <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                                <Button component="span">{options[selectedIndex]}</Button>
                                <Button
                                    color="primary"
                                    size="small"
                                    aria-controls={openBtn ? 'split-button-menu' : undefined}
                                    aria-expanded={openBtn ? 'true' : undefined}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    onClick={handleToggleBtn}
                                >
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>
                        </label>
                        <Popper
                            open={openBtn}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                            modifiers={{
                                offset: {
                                    enabled: true,
                                    offset: '-20, 0'
                                }
                            }}>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: 'center top',
                                        transform: 'translate3d(20px, 400px, 0px), !important'
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseBtn}>
                                            <MenuList id="split-button-menu">
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option}
                                                        disabled={index === 2}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                    >
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
